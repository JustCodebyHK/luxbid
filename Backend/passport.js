const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db'); // adjust path to your MySQL connection

passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: '/auth/google/callback',
  // 👇 This forces Google to show the account chooser
  prompt: 'select_account'
}, async (accessToken, refreshToken, profile, done) => {
  const googleId = profile.id;
  const name = profile.displayName;
  const email = profile.emails[0].value;
  const photo = profile.photos[0]?.value || null;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE google_id = ?', [googleId]);

    if (rows.length === 0) {
      await db.query(
        'INSERT INTO users (google_id, name, email, photo) VALUES (?, ?, ?, ?)',
        [googleId, name, email, photo]
      );
      const newUser = { google_id: googleId, name, email, photo };
      return done(null, newUser);
    } else {
      return done(null, rows[0]); // ✅ Return full user object from DB
    }
  } catch (err) {
    console.error('Database error:', err);
    return done(err, null);
  }
}));

// ✅ Store only google_id in session
passport.serializeUser((user, done) => {
  done(null, user.google_id);
});

// ✅ Fetch full user from DB during session restore
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE google_id = ?', [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;