(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const { t } = window.HaoruI18n;
  const overlay = $('.overlay');
  let authMode = 'register';

  function applySiteLanguage() {
    window.HaoruI18n.apply();
    // Texts set from code follow the language too: the chosen role, the dialog title, form messages.
    const role = $('#registerForm')?.elements?.role?.value;
    if (role) setAuthRole(role);
    if ($('#authModal')) switchAuthMode(authMode);
    $$('.form-message[data-key]').forEach((message) => { message.textContent = t(message.dataset.key); });
  }

  function setAuthRole(role = 'client') {
    const form = $('#registerForm');
    if (!form) return;
    form.elements.role.value = role;
    const forwarder = role === 'forwarder';
    $$('.forwarder-only', form).forEach((block) => { block.hidden = !forwarder; });
    ['company', 'city'].forEach((name) => { if (form.elements[name]) form.elements[name].required = forwarder; });
    if ($('#authRoleMark')) $('#authRoleMark').textContent = forwarder ? '运' : '货';
    if ($('#authRoleName')) $('#authRoleName').textContent = t(forwarder ? 'role.forwarder' : 'role.client');
  }

  function switchAuthMode(mode) {
    authMode = mode === 'login' ? 'login' : 'register';
    const register = authMode === 'register';
    if ($('#registerForm')) $('#registerForm').hidden = !register;
    if ($('#loginForm')) $('#loginForm').hidden = register;
    $$('.auth-tabs button').forEach((button) => button.classList.toggle('active', button.dataset.authMode === authMode));
    if ($('#authTitle')) $('#authTitle').textContent = t(register ? 'auth.registerTitle' : 'auth.loginTitle');
  }

  function openAuth(role = 'client', mode = 'register') {
    setAuthRole(role);
    switchAuthMode(mode);
    openPanel($('#authModal'));
  }

  // A key from the dictionaries (re-translated on a language switch), or a ready text such as a server error.
  function formMessage(id, { key, text }, type = 'error') {
    const message = $(id);
    if (!message) return;
    if (key) message.dataset.key = key;
    else delete message.dataset.key;
    message.textContent = key ? t(key) : text;
    message.className = `form-message ${type}`;
  }

  const openPanel = (panel) => {
    if (!panel) return;
    panel.hidden = false;
    if (overlay) overlay.hidden = false;
    document.body.classList.add('no-scroll');
    const first = $('input, select, textarea, button', panel);
    setTimeout(() => first?.focus(), 80);
  };

  const closePanels = () => {
    $$('.modal, .drawer').forEach((panel) => { panel.hidden = true; });
    if (overlay) overlay.hidden = true;
    document.body.classList.remove('no-scroll');
  };

  document.addEventListener('click', async (event) => {
    const close = event.target.closest('[data-close]');
    if (close) { event.preventDefault(); closePanels(); return; }

    const authRole = event.target.closest('[data-auth-role]');
    if (authRole) { event.preventDefault(); openAuth(authRole.dataset.authRole, 'register'); return; }

    const authModeButton = event.target.closest('[data-auth-mode]');
    if (authModeButton) { event.preventDefault(); switchAuthMode(authModeButton.dataset.authMode); return; }

    const mobileNav = event.target.closest('.mobile-nav');
    if (mobileNav) { event.preventDefault(); $('.topbar')?.classList.toggle('nav-open'); return; }

    if (event.target.closest('[data-action="login"]')) {
      const session = await window.HaoruAuth?.getSession?.();
      const role = window.HaoruAuth?.roleFromSession?.(session);
      if (session && role) location.href = `app/#/${window.HaoruAuth.routeForRole(role)}`;
      else openAuth('client', 'login');
    }
  });

  overlay?.addEventListener('click', closePanels);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closePanels(); });
  window.HaoruI18n.onChange(applySiteLanguage);

  $('#registerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = $('button[type="submit"]', form);
    const data = Object.fromEntries(new FormData(form));
    if (!window.HaoruAuth?.isConfigured) {
      formMessage('#registerMessage', { key: 'auth.msgRegisterNotConfigured' });
      return;
    }
    submit.disabled = true;
    formMessage('#registerMessage', { key: 'auth.msgCreating' }, 'pending');
    try {
      const result = await window.HaoruAuth.signUp(data);
      if (result.session) {
        formMessage('#registerMessage', { key: 'auth.msgCreated' }, 'success');
        location.href = `app/#/${window.HaoruAuth.routeForRole(data.role)}`;
      } else {
        formMessage('#registerMessage', { key: 'auth.msgCheckEmail' }, 'success');
        switchAuthMode('login');
        $('#loginForm').elements.email.value = data.email;
      }
    } catch (error) {
      formMessage('#registerMessage', error.i18nKey ? { key: error.i18nKey } : { text: error.message });
    } finally { submit.disabled = false; }
  });

  $('#loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = $('button[type="submit"]', form);
    const data = Object.fromEntries(new FormData(form));
    if (!window.HaoruAuth?.isConfigured) {
      formMessage('#loginMessage', { key: 'auth.msgLoginNotConfigured' });
      return;
    }
    submit.disabled = true;
    formMessage('#loginMessage', { key: 'auth.msgSigningIn' }, 'pending');
    try {
      const session = await window.HaoruAuth.signIn(data);
      const role = window.HaoruAuth.roleFromSession(session);
      formMessage('#loginMessage', { key: 'auth.msgSignedIn' }, 'success');
      location.href = `app/#/${window.HaoruAuth.routeForRole(role)}`;
    } catch (error) {
      formMessage('#loginMessage', error.i18nKey ? { key: error.i18nKey } : { text: error.message });
    } finally { submit.disabled = false; }
  });

  applySiteLanguage();
  const authParams = new URLSearchParams(location.search);
  if (authParams.get('auth') && $('#authModal')) {
    openAuth(authParams.get('role') === 'forwarder' ? 'forwarder' : 'client', authParams.get('auth') === 'login' ? 'login' : 'register');
  }
})();
