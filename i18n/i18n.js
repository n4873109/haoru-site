// HAORU i18n core: one language setting, key-based dictionaries, locale-aware formatting.
// Dictionaries (ru.js, zh.js, en.js) load before this file and fill window.HAORU_I18N[lang].
// A page lists the languages it offers on <html data-languages="ru zh en">.
(() => {
  const STORAGE_KEY = 'haoru.language';
  // Before the unified setting, the landing and the cabinet each kept their own.
  const LEGACY_KEYS = ['haoru.platform.language', 'haoru.site.language'];
  const KNOWN = ['ru', 'zh', 'en'];
  const LOCALES = { ru: 'ru-RU', zh: 'zh-CN', en: 'en-US' };
  const HTML_LANG = { ru: 'ru', zh: 'zh-CN', en: 'en' };
  const LABELS = { ru: 'RU', zh: '中文', en: 'EN' };
  const dictionaries = window.HAORU_I18N || {};
  const root = document.documentElement;
  const supported = (root.dataset.languages || 'ru').split(/\s+/).filter((lang) => KNOWN.includes(lang));
  if (!supported.length) supported.push('ru');

  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (error) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (error) { /* kept for this page only */ } },
    remove(key) { try { localStorage.removeItem(key); } catch (error) { /* nothing to clean */ } }
  };

  function migrateLegacySetting() {
    const legacy = LEGACY_KEYS.map((key) => storage.get(key)).find((value) => KNOWN.includes(value));
    if (legacy && !storage.get(STORAGE_KEY)) storage.set(STORAGE_KEY, legacy);
    LEGACY_KEYS.forEach((key) => storage.remove(key));
  }

  // First visit: the first browser language this page offers. Only a manual choice is stored.
  function detect() {
    const preferred = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
    for (const tag of preferred) {
      const base = String(tag).toLowerCase().split('-')[0];
      if (supported.includes(base)) return base;
    }
    return supported[0];
  }

  migrateLegacySetting();
  const saved = storage.get(STORAGE_KEY);
  // A stored language this page doesn't offer (EN on the landing) falls back to detection, and stays stored.
  let current = supported.includes(saved) ? saved : detect();

  const pluralCache = {};
  const pluralRules = () => (pluralCache[current] ||= new Intl.PluralRules(LOCALES[current]));
  const warned = new Set();

  function lookup(lang, key) {
    const dictionary = dictionaries[lang];
    return dictionary && Object.prototype.hasOwnProperty.call(dictionary, key) ? dictionary[key] : undefined;
  }

  function resolve(key, params) {
    let value = lookup(current, key);
    if (value === undefined) value = lookup('ru', key);
    if (value === undefined) {
      if (!warned.has(key)) { warned.add(key); console.warn(`HAORU i18n: no text for "${key}"`); }
      return key;
    }
    if (value && typeof value === 'object') {
      const count = Number(params.count);
      value = value[pluralRules().select(count)] ?? value.other;
    }
    return String(value);
  }

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const formatParam = (value) => (typeof value === 'number' ? fmt.number(value) : value);

  // Plain text. {name} placeholders are filled from params; {count} also picks the plural form.
  function t(key, params = {}) {
    return resolve(key, params).replace(/\{(\w+)\}/g, (match, name) => (params[name] === undefined ? match : String(formatParam(params[name]))));
  }

  // For HTML templates: the dictionary text is trusted markup, params are escaped.
  function tHtml(key, params = {}) {
    return resolve(key, params).replace(/\{(\w+)\}/g, (match, name) => (params[name] === undefined ? match : escapeHtml(formatParam(params[name]))));
  }

  const fmt = {
    locale: () => LOCALES[current],
    number: (value, options = {}) => new Intl.NumberFormat(LOCALES[current], options).format(Number(value || 0)),
    // The currency is the one in the request or offer; prices are never converted.
    money: (value, currency = 'RUB') => new Intl.NumberFormat(LOCALES[current], {
      style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0
    }).format(Number(value || 0)),
    // ISO yyyy-mm-dd → «12 ноября» / «11月12日» / «November 12»; the year only when it is not the current one.
    date(value, options = {}) {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
      if (!match) return value || '—';
      const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
      const year = date.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {};
      return new Intl.DateTimeFormat(LOCALES[current], { day: 'numeric', month: 'long', ...year, ...options })
        .format(date).replace(/\s*г\.$/, ''); // i18n-ignore: drops the Russian «г.» year suffix
    },
    // ['Гуанчжоу', 'Иу', 'Шэньчжэнь'] → «Гуанчжоу, Иу и Шэньчжэнь» / «广州、义乌和深圳».
    list: (items) => new Intl.ListFormat(LOCALES[current], { style: 'long', type: 'conjunction' }).format(items),
    // Minutes before now → «12 минут назад» / «12分钟前» / «12 minutes ago», «вчера» for a day.
    // style 'short' → «12 мин. назад» for narrow columns.
    ago(minutes, style = 'long') {
      const rtf = new Intl.RelativeTimeFormat(LOCALES[current], { numeric: 'auto', style });
      const value = Number(minutes || 0);
      if (value < 1) return rtf.format(0, 'second');
      if (value < 60) return rtf.format(-Math.round(value), 'minute');
      if (value < 60 * 24) return rtf.format(-Math.round(value / 60), 'hour');
      return rtf.format(-Math.round(value / (60 * 24)), 'day');
    }
  };

  // data-i18n="key" → text; data-i18n-html="key" → markup from the dictionary;
  // data-i18n-attr="placeholder:key;aria-label:key" → attributes (also <meta content>).
  function apply(scope = document) {
    root.lang = HTML_LANG[current];
    const select = (selector) => [
      ...(scope.matches?.(selector) ? [scope] : []),
      ...scope.querySelectorAll(selector)
    ];
    select('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
    select('[data-i18n-html]').forEach((element) => { element.innerHTML = t(element.dataset.i18nHtml); });
    select('[data-i18n-attr]').forEach((element) => {
      element.dataset.i18nAttr.split(';').map((pair) => pair.trim()).filter(Boolean).forEach((pair) => {
        const [attribute, key] = pair.split(':').map((part) => part.trim());
        element.setAttribute(attribute, t(key));
      });
    });
    renderSwitchers(scope);
  }

  // <div data-language-switch></div> → one visible button per language the page offers.
  function renderSwitchers(scope = document) {
    const switches = [...(scope.matches?.('[data-language-switch]') ? [scope] : []), ...scope.querySelectorAll('[data-language-switch]')];
    switches.forEach((container) => {
      container.setAttribute('role', 'group');
      container.innerHTML = supported.map((lang) => `<button type="button" lang="${HTML_LANG[lang]}" data-set-language="${lang}" aria-pressed="${lang === current}">${LABELS[lang]}</button>`).join('');
    });
  }

  // Stores the choice and announces it; the page re-renders and calls apply() in its 'haoru:language' handler.
  function setLang(lang) {
    if (!supported.includes(lang)) return current;
    storage.set(STORAGE_KEY, lang);
    if (lang === current) return current;
    current = lang;
    root.lang = HTML_LANG[current];
    document.dispatchEvent(new CustomEvent('haoru:language', { detail: { lang } }));
    return current;
  }

  // Cities (i18n/cities.js): matched by any name or alias, shown in the current language.
  const cityList = window.HAORU_CITIES || [];
  const normalizeCity = (text) => String(text || '').trim().toLowerCase().replace(/ё/g, 'е').replace(/[\s-]+/g, ' '); // i18n-ignore: «ё» is matched as «е»
  const cityIndex = new Map();
  cityList.forEach((city) => [city.ru, city.zh, city.en, ...(city.aliases || [])]
    .forEach((name) => cityIndex.set(normalizeCity(name), city)));
  const cities = {
    find: (text) => cityIndex.get(normalizeCity(text)) || null,
    byId: (id) => cityList.find((city) => city.id === id) || null,
    name: (id) => { const city = cityList.find((item) => item.id === id); return city ? city[current] || city.ru : ''; },
    list: (country) => cityList.filter((city) => !country || city.country === country)
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-set-language]');
    if (button) { event.preventDefault(); setLang(button.dataset.setLanguage); }
  });

  window.HaoruI18n = {
    get lang() { return current; },
    languages: supported.slice(),
    t, tHtml, fmt, apply, setLang, escapeHtml, cities,
    has: (key) => lookup(current, key) !== undefined || lookup('ru', key) !== undefined,
    onChange(callback) { document.addEventListener('haoru:language', (event) => callback(event.detail.lang)); }
  };
})();
