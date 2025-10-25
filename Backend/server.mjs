import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// MySQL connection
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bidding_site'
});
console.log('✅ Connected to MySQL');

// 🔐 Session logging utility
async function logSession(userId, type, req) {
  if (type === 'login') {
    const [result] = await db.query(
      'INSERT INTO user_sessions (user_id, login_type) VALUES (?, ?)',
      [userId, req.session.isUser ? 'google' : 'admin']
    );
    req.session.sessionId = result.insertId;
  }

  if (type === 'logout') {
    const sessionId = req.session.sessionId;
    if (sessionId) {
      await db.query(
        'UPDATE user_sessions SET logout_time = NOW() WHERE id = ?',
        [sessionId]
      );
      req.session.sessionId = null;
    }
  }
}

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
  prompt: 'select_account',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  const id = profile.id;
  const name = profile.displayName;
  const email = profile.emails[0].value;
  const photo = profile.photos[0]?.value || null;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE google_id = ?', [id]);
    if (rows.length === 0) {
      await db.query(
        'INSERT INTO users (google_id, name, email, photo) VALUES (?, ?, ?, ?)',
        [id, name, email, photo]
      );
    }
    const [user] = await db.query('SELECT * FROM users WHERE google_id = ?', [id]);
    req.session.isUser = true;
    return done(null, user[0]);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id || user.google_id);
});

passport.deserializeUser(async (req, id, done) => {
  try {
    if (!req.session?.isUser) return done(null, false); // Skip admin sessions
    const [rows] = await db.query('SELECT * FROM users WHERE id = ? OR google_id = ?', [id, id]);
    if (rows.length > 0) return done(null, rows[0]);
    return done(null, false);
  } catch (err) {
    return done(err, null);
  }
});

// Auth middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send('Not logged in');
}

function isAdmin(req, res, next) {
  if (req.session.adminId) return next();
  res.status(403).send('Access denied');
}

// Routes
app.get('/', (req, res) => {
  res.send('LuxBid backend is running');
});

// Google OAuth
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), async (req, res) => {
  req.session.isUser = true;
  console.log('✅ Google login successful:', req.user);

  await logSession(req.user.id, 'login', req);

  res.redirect(`${process.env.FRONTEND_URL}/index.html`);
});

app.get('/logout', async (req, res) => {
  await logSession(req.user?.id, 'logout', req);
  req.logout(() => {
    req.session.isUser = null;
    console.log('🔒 User logged out');
    res.redirect(`${process.env.FRONTEND_URL}/index.html?loggedOut=true`);
  });
});

app.get('/dashboard', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/me', isLoggedIn, (req, res) => {
  res.json(req.user);
});

// Manual login/signup
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];
  if (!user) return res.status(401).send('Invalid email or password');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send('Invalid email or password');

  req.login(user, async (err) => {
    if (err) return res.status(500).send('Login error');
    req.session.isUser = true;
    req.session.userId = user.id;

    await logSession(user.id, 'login', req);

    res.send('Login successful');
  });
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
  res.send('Signup successful');
});

// Bidding
app.get('/api/properties', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM properties');
  res.json(rows);
});

app.post('/api/bid', isLoggedIn, async (req, res) => {
  const { property_id, bid_amount } = req.body;
  const user_id = req.user.id;
  await db.query(
    'INSERT INTO bids (user_id, property_id, bid_amount) VALUES (?, ?, ?)',
    [user_id, property_id, bid_amount]
  );
  res.send('Bid placed');
});

app.get('/api/my-bids', isLoggedIn, async (req, res) => {
  const [rows] = await db.query(`
    SELECT b.id, p.title, b.bid_amount, b.bid_time
    FROM bids b
    JOIN properties p ON b.property_id = p.id
    WHERE b.user_id = ?
  `, [req.user.id]);
  res.json(rows);
});

// Admin system
app.get('/admin/session-check', (req, res) => {
  if (req.session.adminId) return res.sendStatus(200);
  res.sendStatus(403);
});

app.get('/admin/dashboard', isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin_dashboard.html'));
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
  if (rows.length === 0) return res.status(401).send('Invalid username');

  const admin = rows[0];
  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).send('Incorrect password');

  req.session.adminId = admin.id;
  // Admin session logging (login)
  try {
    const [result] = await db.query(
      'INSERT INTO admin_sessions (admin_id) VALUES (?)',
      [admin.id]
    );
    req.session.adminSessionId = result.insertId;
  } catch (e) {
    console.error('⚠️ Failed to log admin login session:', e);
  }
  res.redirect('/admin/dashboard');
});

app.post('/admin/logout', async (req, res) => {
  await logSession(req.session.adminId, 'logout', req);
  req.session.adminId = null;
  // Admin session logging (logout)
  try {
    if (req.session.adminSessionId) {
      await db.query(
        'UPDATE admin_sessions SET logout_time = NOW() WHERE id = ?',
        [req.session.adminSessionId]
      );
      req.session.adminSessionId = null;
    }
  } catch (e) {
    console.error('⚠️ Failed to log admin logout session:', e);
  }
  res.sendStatus(200);
});

app.post('/admin/add-property', isAdmin, async (req, res) => {
  const { title, location, description, starting_price, image_url } = req.body;
  await db.query(
    'INSERT INTO properties (title, description, location, starting_price, image_url) VALUES (?, ?, ?, ?, ?)',
    [title, description, location, starting_price, image_url]
  );
  res.sendStatus(200);
});

app.put('/admin/update-property/:id', isAdmin, async (req, res) => {
  const id = req.params.id;
  const { title, location, description, starting_price, image_url } = req.body;

  try {
    await db.query(
      'UPDATE properties SET title = ?, location = ?, description = ?, starting_price = ?, image_url = ? WHERE id = ?',
      [title, location, description, starting_price, image_url, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Error updating property:', err);
    res.status(500).send('Failed to update property');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 LuxBid backend running at http://localhost:${PORT}`);
});