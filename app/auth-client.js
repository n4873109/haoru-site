(() => {
  const SESSION_KEY = 'haoru.auth.session.v1';
  const config = window.HAORU_SUPABASE || {};
  const baseUrl = String(config.url || '').replace(/\/$/, '');
  const publishableKey = String(config.publishableKey || '');
  const isConfigured = /^https:\/\/.+\.supabase\.co$/i.test(baseUrl) && /^sb_publishable_/.test(publishableKey);
  // Supabase error codes → dictionary keys. The server's own (English) text goes to the console only.
  const ERROR_KEYS = {
    invalid_credentials: 'error.invalidCredentials', invalid_grant: 'error.invalidCredentials',
    user_already_exists: 'error.userExists', email_exists: 'error.userExists',
    weak_password: 'error.weakPassword',
    over_email_send_rate_limit: 'error.rateLimit', over_request_rate_limit: 'error.rateLimit',
    email_not_confirmed: 'error.emailNotConfirmed',
    email_address_invalid: 'error.invalidEmail', validation_failed: 'error.invalidEmail',
    signup_disabled: 'error.signupDisabled', email_provider_disabled: 'error.signupDisabled'
  };

  // The message is in the current language; i18nKey lets the page re-translate it later.
  function appError(key, extra = {}) {
    const error = new Error(window.HaoruI18n ? window.HaoruI18n.t(key) : key);
    return Object.assign(error, { i18nKey: key }, extra);
  }

  function saveSession(session) {
    if (!session?.access_token) return null;
    const normalized = {
      ...session,
      expires_at: session.expires_at || Math.floor(Date.now() / 1000) + Number(session.expires_in || 3600)
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
    return normalized;
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function readSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch { clearSession(); return null; }
  }

  async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
    if (!isConfigured) throw appError('error.notConfigured');
    let response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          apikey: publishableKey,
          ...(body && !(body instanceof Blob) ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers
        },
        body: body instanceof Blob ? body : body ? JSON.stringify(body) : undefined
      });
    } catch {
      // fetch rejects only when no HTTP response arrived (offline, DNS, CORS, timeout).
      throw appError('error.network', { network: true });
    }
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const code = payload?.error_code || payload?.error;
      const key = ERROR_KEYS[code] || (response.status === 429 ? 'error.rateLimit' : 'error.requestFailed');
      console.warn('HAORU request failed', response.status, payload?.msg || payload?.message || payload?.error_description || payload);
      throw appError(key, { status: response.status, code });
    }
    return payload;
  }

  async function refreshSession(session) {
    if (!session?.refresh_token) return null;
    try {
      const next = await request('/auth/v1/token?grant_type=refresh_token', {
        method: 'POST', body: { refresh_token: session.refresh_token }
      });
      return saveSession(next);
    } catch (error) {
      // Supabase answers 400 for an invalid/used refresh token; only then is the session really dead.
      if ([400, 401, 403].includes(error.status)) {
        clearSession();
        return null;
      }
      // Network failure or server outage: keep the stored session and retry on the next request.
      return session;
    }
  }

  async function getSession() {
    if (!isConfigured) return null;
    let session = readSession();
    if (!session) return null;
    if (Number(session.expires_at || 0) <= Math.floor(Date.now() / 1000) + 90) {
      session = await refreshSession(session);
    }
    return session;
  }

  async function signUp({ email, password, role, fullName, phone, company, city, wechat }) {
    const payload = await request('/auth/v1/signup', {
      method: 'POST',
      body: {
        email, password,
        data: {
          role,
          full_name: fullName,
          phone: phone || null,
          company: company || null,
          city: city || null,
          wechat: wechat || null
        }
      }
    });
    return { user: payload.user || null, session: saveSession(payload) };
  }

  async function signIn({ email, password }) {
    const payload = await request('/auth/v1/token?grant_type=password', {
      method: 'POST', body: { email, password }
    });
    return saveSession(payload);
  }

  async function getUser() {
    const session = await getSession();
    if (!session) return null;
    try { return await request('/auth/v1/user', { token: session.access_token }); }
    catch (error) {
      if (error.status === 401 || error.status === 403) { clearSession(); return null; }
      throw error;
    }
  }

  async function getProfile() {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!session || !userId) return null;
    const rows = await request(`/rest/v1/profiles?select=id,role,full_name,phone,company,city,wechat&id=eq.${encodeURIComponent(userId)}&limit=1`, {
      token: session.access_token
    });
    return Array.isArray(rows) ? rows[0] || null : null;
  }

  async function signOut() {
    const session = readSession();
    if (session?.access_token) {
      try { await request('/auth/v1/logout', { method: 'POST', token: session.access_token }); }
      catch { /* Local logout must still complete if the network is unavailable. */ }
    }
    clearSession();
  }

  async function uploadCargoPhoto(file, requestId) {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!session || !userId) throw appError('error.signInFirst');
    const safeName = String(file.name || 'cargo-photo').replace(/[^a-z0-9._-]+/gi, '-').toLowerCase();
    const path = `${userId}/${requestId}/${Date.now()}-${safeName}`;
    await request(`/storage/v1/object/cargo-photos/${encodeURI(path)}`, {
      method: 'POST', token: session.access_token, body: file,
      headers: { 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'false' }
    });
    return { path, name: file.name, type: file.type, size: file.size };
  }

  const roleFromSession = (session) => session?.profile?.role || session?.user?.user_metadata?.role || null;
  const routeForRole = (role) => role === 'forwarder' ? 'forwarder/dashboard' : 'client/dashboard';

  window.HaoruAuth = {
    isConfigured, signUp, signIn, signOut, getSession, getUser, getProfile,
    uploadCargoPhoto, roleFromSession, routeForRole
  };
})();
