// Auth wrapper that uses the PHP backend when available and falls back to demo mode.
(function(){
  const USER_KEY = 'lux_user';
  const TOKEN_KEY = 'lux_token';
  const BACKEND_BASE = window.__LUX_BACKEND_BASE__ || '';

  function saveUser(u){ localStorage.setItem(USER_KEY, JSON.stringify(u)); }
  function loadUser(){ try { return JSON.parse(localStorage.getItem(USER_KEY)||'null'); } catch { return null; } }
  function clearUser(){ localStorage.removeItem(USER_KEY); }
  function saveToken(t){ if (!t) localStorage.removeItem(TOKEN_KEY); else localStorage.setItem(TOKEN_KEY, t); }
  function loadToken(){ return localStorage.getItem(TOKEN_KEY) || null; }

  // Helper to call backend; throws on network error
  async function api(path, opts = {}){
    const url = (BACKEND_BASE || '') + path;
    const headers = opts.headers || {};
    const token = loadToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
    const res = await fetch(url, Object.assign({ credentials: 'same-origin', headers }, opts));
    if (!res.ok) {
      const text = await res.text().catch(()=>null);
      let json = null;
      try { json = JSON.parse(text); } catch {}
      const err = new Error(json?.message || res.statusText || 'Request failed');
      err.status = res.status;
      err.body = json || text;
      throw err;
    }
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    return res.text();
  }

  // Demo fallback login (same shape as backend response)
  function demoLogin(email, role){
    const u = { id: role==='admin' ? 'demo-admin' : 'demo-user', email, role: role||'user', name: role==='admin' ? 'Demo Admin' : 'Demo User' };
    saveUser(u); saveToken(null);
    return { user: u };
  }

  window.auth = {
    getUser(){ return loadUser(); },

    // login(email, password) -> returns Promise resolving to { user, token }
    async login(email, password){
      try {
        const data = await api('/api/auth/login', { method: 'POST', body: { email, password } });
        if (data.token) saveToken(data.token);
        if (data.user) saveUser(data.user);
        return data;
      } catch (e) {
        // If backend unreachable (network error) fallback to demo mode
        if (e instanceof TypeError || e.status === 0) {
          return demoLogin(email, email==='admin@demo.local' ? 'admin' : 'user');
        }
        throw e;
      }
    },

    // register(email, password, name) -> returns Promise resolving to { user, token }
    async register(email, password, name){
      try {
        const data = await api('/api/auth/register', { method: 'POST', body: { email, password, name } });
        if (data.token) saveToken(data.token);
        if (data.user) saveUser(data.user);
        return data;
      } catch (e) {
        // fallback: create demo user locally
        if (e instanceof TypeError || e.status === 0) {
          const role = 'user';
          const u = { id: 'demo-user', email, role, name };
          saveUser(u); saveToken(null);
          return { user: u };
        }
        throw e;
      }
    },

    async me(){
      try {
        const data = await api('/api/auth/me', { method: 'GET' });
        if (data.user) saveUser(data.user);
        return data;
      } catch (e) {
        // fallback: return stored user or null
        return { user: loadUser() };
      }
    },

    logout(){ saveToken(null); clearUser(); }
  };
})();