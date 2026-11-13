(() => {
  const STORAGE_KEY = 'haoru.prototype.v1';
  // Left in browsers by the removed marketing-site demo (client.html / forwarder.html).
  const LEGACY_DEMO_KEYS = ['haoruRequests'];
  const { t, tHtml } = window.HaoruI18n;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  // Numbers follow the interface language; the currency is the one in the request or offer.
  const money = (value, currency = 'RUB') => window.HaoruI18n.fmt.money(value, currency);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const iconPaths = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M9 9h6M9 13h6M9 17h4"/>',
    building: '<path d="M4 21V7l8-4 8 4v14M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M9 21v-3h6v3"/>',
    handshake: '<path d="m8 12 2 2c1 1 2.2 1 3.2.2l3.5-3.2"/><path d="m15 8 2-2 4 4-2.4 2.4M9 8 7 6l-4 4 3 3M11 7l2-1 3 2-5 5-3-3 3-3Z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    scale: '<path d="M12 3v18M5 7h14M7 7 3 14h8L7 7Zm10 0-4 7h8l-4-7ZM5 21h14"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3"/>',
    bid: '<path d="M4 7h11M4 12h16M4 17h9"/><path d="m17 4 3 3-3 3"/>',
    checkUser: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8"/><path d="m16 11 2 2 4-4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    file: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    logout: '<path d="M10 17l5-5-5-5M15 12H3M15 3h5v18h-5"/>'
  };
  const svgIcon = (name, size = 18) => `<svg class="line-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.route}</svg>`;

  // Demo data stores codes (category, logistics, transport, customs, services) and city ids;
  // labels come from the dictionaries. Offer comments and request details are user text and stay as written.
  const initialRequests = [
    {
      id: 'HR-1048', status: 'active', fromCity: 'guangzhou', from: 'Гуанчжоу', toCity: 'moscow', to: 'Москва', // i18n-ignore: typed city text
      category: 'marketplace', weight: 420, volume: 2.4, places: 12,
      ready: '2026-11-12', logistics: 'cargo', transport: 'roadRail', auctionDuration: 48,
      timeLeft: 26340, budget: 200000, currency: 'RUB', services: ['insurance', 'customs', 'door'],
      details: 'Нужна усиленная упаковка и доставка до склада в Москве.', // i18n-ignore: client's own text
      offers: [
        { id: 'OF-501', company: 'Dragon Bridge', mark: '龙', verified: true, rating: 4.9, price: 186000, currency: 'RUB', days: 17, transport: 'roadRail', customs: 'included', services: ['insurance', 'door'], comment: 'Заберём груз со склада поставщика, включим усиленную упаковку и доставку до двери.', updatedAgo: 12 }, // i18n-ignore: forwarder's own text
        { id: 'OF-502', company: 'Yunhe Logistics', mark: '云', verified: true, rating: 4.8, price: 198000, currency: 'RUB', days: 14, transport: 'rail', customs: 'included', services: ['door'], comment: 'Отправка ближайшим поездом. Цена включает таможенное оформление и доставку до склада.', updatedAgo: 34 }, // i18n-ignore: forwarder's own text
        { id: 'OF-503', company: 'SinoLine', mark: '海', verified: true, rating: 4.7, price: 214000, currency: 'RUB', days: 20, transport: 'seaRoad', customs: 'separate', services: ['insurance', 'door'], comment: 'Подойдёт для несрочного груза. Таможенные платежи рассчитываются после получения инвойса.', updatedAgo: 60 } // i18n-ignore: forwarder's own text
      ]
    },
    {
      id: 'HR-1051', status: 'active', fromCity: 'shenzhen', from: 'Шэньчжэнь', toCity: 'kazan', to: 'Казань', // i18n-ignore: typed city text
      category: 'equipment', weight: 1850, volume: 6, places: 8, ready: '2026-11-16',
      logistics: 'official', transport: 'rail', auctionDuration: 48, timeLeft: 116820,
      budget: 5000, currency: 'USD', services: ['customs', 'door'], details: 'Деревянные ящики, не кантовать.', // i18n-ignore: client's own text
      offers: [
        { id: 'OF-511', company: 'EastRail Cargo', mark: '铁', verified: true, rating: 4.8, price: 4720, currency: 'USD', days: 21, transport: 'rail', customs: 'included', services: ['door'], comment: 'Погрузка с контролем крепления деревянных ящиков. Не кантовать — учтено.', updatedAgo: 18 }, // i18n-ignore: forwarder's own text
        { id: 'OF-512', company: 'Dragon Bridge', mark: '龙', verified: true, rating: 4.9, price: 4890, currency: 'USD', days: 18, transport: 'roadRail', customs: 'included', services: ['insurance'], comment: 'Ускоренный маршрут через Казахстан, страхование включено.', updatedAgo: 48 } // i18n-ignore: forwarder's own text
      ]
    },
    {
      id: 'HR-1039', status: 'waiting', fromCity: 'yiwu', from: 'Иу', toCity: 'saint-petersburg', to: 'Санкт-Петербург', // i18n-ignore: typed city text
      category: 'apparel', weight: 760, volume: 4.1, places: 24, ready: '2026-11-08',
      logistics: 'cargo', transport: 'any', auctionDuration: 48, timeLeft: 0,
      budget: 240000, currency: 'RUB', services: ['consolidation', 'door'], details: '',
      offers: [
        { id: 'OF-491', company: 'Red Gate Logistics', mark: '门', verified: true, rating: 4.7, price: 228000, currency: 'RUB', days: 19, transport: 'road', customs: 'included', services: ['consolidation', 'door'], updatedAgo: 1440 },
        { id: 'OF-492', company: 'SinoLine', mark: '海', verified: true, rating: 4.7, price: 235000, currency: 'RUB', days: 17, transport: 'rail', customs: 'included', services: ['door'], updatedAgo: 1440 }
      ]
    },
    {
      id: 'HR-1027', status: 'chosen', chosenOfferId: 'OF-471', fromCity: 'ningbo', from: 'Нинбо', toCity: 'yekaterinburg', to: 'Екатеринбург', // i18n-ignore: typed city text
      category: 'furniture', weight: 2400, volume: 14, places: 30, ready: '2026-11-02',
      logistics: 'official', transport: 'seaRail', auctionDuration: 72, timeLeft: 0,
      budget: 6300, currency: 'USD', services: ['insurance', 'customs', 'door'], details: '',
      offers: [
        { id: 'OF-471', company: 'Yunhe Logistics', mark: '云', verified: true, rating: 4.8, price: 6140, currency: 'USD', days: 28, transport: 'seaRail', customs: 'included', services: ['insurance', 'door'], updatedAgo: 5760 }
      ]
    },
    {
      id: 'DRAFT-1', status: 'draft', fromCity: 'foshan', from: 'Фошань', toCity: 'novosibirsk', to: 'Новосибирск', // i18n-ignore: typed city text
      category: 'furniture', weight: 0, volume: 0, places: 0, ready: '', logistics: 'cargo',
      transport: 'any', auctionDuration: 48, timeLeft: 0, budget: 0, currency: 'RUB', services: [], details: '', offers: []
    }
  ];

  // dataVersion 2: codes instead of Russian labels, city ids (see migrateState).
  const defaultState = {
    dataVersion: 2,
    role: null,
    requestCounter: 1052,
    requests: initialRequests,
    deals: [
      { id: 'DL-203', requestId: 'HR-1027', delivery: 'inProgress', contactsOpen: true, confirmations: { client: false, forwarder: false } }
    ],
    notificationsRead: { client: false, forwarder: false }
  };

  // Company of the demo forwarder account: it sees only deals where its offer was chosen.
  const DEMO_FORWARDER = 'Dragon Bridge';
  // «Таблица / Карточки» on the request page: the card view of offers doesn't exist yet.
  const SHOW_OFFER_VIEW_TOGGLE = false;

  // spec lists the dictionary keys shown in the «Специализация» column.
  const companies = [
    { name: 'Dragon Bridge', mark: '龙', city: 'guangzhou', spec: ['logistics.cargo', 'transport.road', 'transport.rail'], logistics: ['cargo'], transport: ['road', 'rail'], services: ['insurance', 'door'], rating: 4.9, deals: 126 },
    { name: 'Yunhe Logistics', mark: '云', city: 'yiwu', spec: ['logistics.official', 'transport.rail', 'service.customs'], logistics: ['official'], transport: ['rail'], services: ['customs', 'door'], rating: 4.8, deals: 89 },
    { name: 'SinoLine', mark: '海', city: 'shenzhen', spec: ['transport.sea', 'transport.air', 'transport.road'], logistics: ['cargo', 'official'], transport: ['sea', 'air', 'road'], services: ['insurance'], rating: 4.7, deals: 74 },
    { name: 'EastRail Cargo', mark: '铁', city: 'xian', spec: ['logistics.official', 'transport.rail'], logistics: ['official'], transport: ['rail'], services: ['customs'], rating: 4.8, deals: 62 }
  ];

  // System notifications of the demo accounts, built in the UI language: [mark, title, details, minutes ago].
  // The marks are the brand's Chinese glyphs and stay the same in every language.
  const notifications = {
    client: () => [
      ['价', t('notif.priceUpdated', { id: 'HR-1048' }), t('notif.priceUpdatedText', { company: 'Dragon Bridge', price: money(186000, 'RUB') }), 12],
      ['新', t('notif.newOffer', { id: 'HR-1051' }), t('notif.newOfferText', { company: 'EastRail Cargo', term: t('unit.days', { count: 21 }) }), 18],
      ['时', t('notif.auctionClosed', { id: 'HR-1039' }), t('notif.auctionClosedText'), 60],
      ['验', t('notif.companyVerified'), t('notif.companyVerifiedText', { company: 'Yunhe Logistics' }), 1440]
    ],
    forwarder: () => [
      ['邀', t('activity.invitation'), t('notif.invitationText', { id: 'HR-1051' }), 8],
      ['价', t('notif.bestBid'), t('notif.bestBidText', { id: 'HR-1048' }), 12],
      ['时', t('notif.closingSoon', { count: 2 }), t('page.request', { id: 'HR-1048' }), 300]
    ]
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));
  let state = loadState();
  let wizardStep = 1;
  let selectedLoadId = null;
  let selectedOffer = null;
  let toastTimer;
  let authSession = null;
  let authUser = null;
  let selectedCargoFile = null;
  let cargoPreviewUrl = null;

  function freshState() {
    return clone(defaultState);
  }

  // Saves before dataVersion 2 kept Russian labels in the data. They become codes here; values that
  // don't match a known label (free text) stay as they are and are shown as typed.
  const LEGACY_CODES = {
    category: { 'Товары для маркетплейсов': 'marketplace', 'Электроника': 'electronics', 'Одежда и текстиль': 'apparel', 'Оборудование': 'equipment', 'Мебель и интерьер': 'furniture' }, // i18n-ignore
    logistics: { 'Карго': 'cargo', 'Официальная': 'official' }, // i18n-ignore
    transport: { 'Не важно': 'any', 'Авто': 'road', 'Ж/д': 'rail', 'Море': 'sea', 'Авиа': 'air', 'Мультимодальный': 'multimodal', 'Авто + ж/д': 'roadRail', 'Море + авто': 'seaRoad', 'Море + ж/д': 'seaRail' }, // i18n-ignore
    customs: { 'Включено': 'included', 'Оплачивается отдельно': 'separate', 'Не требуется': 'notNeeded' }, // i18n-ignore
    service: { 'Страхование': 'insurance', 'Консолидация': 'consolidation', 'Таможенное оформление': 'customs', 'Таможня': 'customs', 'До двери': 'door', 'Обрешётка': 'crating' }, // i18n-ignore
    updated: { 'только что': 0, '12 минут назад': 12, '18 минут назад': 18, '34 минуты назад': 34, '48 минут назад': 48, '1 час назад': 60, 'вчера': 1440, '4 дня назад': 5760 }, // i18n-ignore
    delivery: { 'В работе': 'inProgress', 'Подготовка к перевозке': 'preparing' }, // i18n-ignore
    notSpecified: 'Не указано' // i18n-ignore
  };

  function migrateState(saved) {
    if (saved.dataVersion >= 2) return;
    const code = (table, value) => (Object.prototype.hasOwnProperty.call(table, value) ? table[value] : value);
    const blank = (value) => (value === LEGACY_CODES.notSpecified ? '' : value);
    saved.requests.forEach((request) => {
      ['from', 'to'].forEach((side) => {
        request[side] = blank(request[side]);
        request[`${side}City`] = window.HaoruI18n.cities.find(request[side])?.id || null;
        delete request[`${side}Zh`];
      });
      request.category = code(LEGACY_CODES.category, blank(request.category));
      request.ready = blank(request.ready);
      request.logistics = code(LEGACY_CODES.logistics, request.logistics);
      request.transport = code(LEGACY_CODES.transport, request.transport);
      request.services = (request.services || []).map((value) => code(LEGACY_CODES.service, value));
      (request.offers || []).forEach((offer) => {
        offer.transport = code(LEGACY_CODES.transport, offer.transport);
        offer.customs = code(LEGACY_CODES.customs, offer.customs);
        offer.services = (offer.services || []).map((value) => code(LEGACY_CODES.service, value));
        offer.rating = Number(String(offer.rating || '').replace(',', '.')) || null;
        if (offer.updatedAgo === undefined && !offer.updatedAt) offer.updatedAgo = code(LEGACY_CODES.updated, offer.updated) || 0;
        delete offer.updated;
      });
    });
    (saved.deals || []).forEach((deal) => {
      deal.delivery = code(LEGACY_CODES.delivery, deal.delivery);
      delete deal.status;
    });
    saved.dataVersion = 2;
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && Array.isArray(saved.requests)) {
        const initialOfferComments = new Map(initialRequests.flatMap((request) => request.offers.map((offer) => [offer.id, offer.comment || ''])));
        saved.requests.forEach((request) => request.offers?.forEach((offer) => {
          if (!offer.comment && initialOfferComments.has(offer.id)) offer.comment = initialOfferComments.get(offer.id);
        }));
        migrateState(saved);
        delete saved.language; // the language lives in haoru.language, not in the demo data
        return { ...clone(defaultState), ...saved };
      }
    } catch (error) {
      console.warn('HAORU demo state could not be loaded', error);
    }
    return freshState();
  }

  // Demo data is per account: it is wiped on logout and whenever another account opens the cabinet.
  function resetDemoState() {
    try {
      [STORAGE_KEY, ...LEGACY_DEMO_KEYS].forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn('HAORU demo state could not be cleared', error);
    }
    state = freshState();
  }

  function bindDemoStateToOwner(ownerId) {
    if (state.ownerId === ownerId) return;
    resetDemoState();
    state.ownerId = ownerId;
    saveState();
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) {
      console.warn('HAORU demo state could not be saved', error);
    }
  }

  // Page title and subtitle per role and view: page.<role>.<view>.title / .subtitle.
  const routeViews = {
    client: ['dashboard', 'requests', 'companies', 'deals', 'notifications'],
    forwarder: ['dashboard', 'loads', 'offers', 'verification', 'deals', 'notifications']
  };

  // A one-item entry is a group label (menu.group.*); the others are [view, icon] with the label menu.<view>.
  const navigation = {
    client: [
      ['main'],
      ['dashboard', 'home'], ['requests', 'clipboard'], ['companies', 'building'],
      ['work'],
      ['deals', 'handshake'], ['notifications', 'bell']
    ],
    forwarder: [
      ['work'],
      ['dashboard', 'home'], ['loads', 'clipboard'], ['offers', 'bid'],
      ['company'],
      ['verification', 'checkUser'], ['deals', 'handshake'], ['notifications', 'bell']
    ]
  };

  function parseRoute() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!parts.length || parts[0] === 'login') return { gate: true };
    const role = ['client', 'forwarder'].includes(parts[0]) ? parts[0] : state.role;
    const view = parts[1] || 'dashboard';
    return { gate: !role, role, view, id: parts[2] || null };
  }

  function go(path) {
    location.hash = `#/${path.replace(/^\//, '')}`;
  }

  // key → toast.<key>.title / toast.<key>.text in the current language.
  function showToast(key, params = {}) {
    const toast = $('#toast');
    $('b', toast).textContent = t(`toast.${key}.title`, params);
    $('small', toast).textContent = t(`toast.${key}.text`, params);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    $('#scrim').hidden = false;
    document.body.classList.add('no-scroll');
    setTimeout(() => $('input,select,textarea,button', modal)?.focus(), 40);
  }

  function closeOverlays() {
    $$('.modal').forEach((modal) => { modal.hidden = true; });
    $('#appSidebar').classList.remove('open');
    $('#profileMenu').hidden = true;
    $('#profileButton').setAttribute('aria-expanded', 'false');
    $('#scrim').hidden = true;
    document.body.classList.remove('no-scroll');
  }

  function renderChrome(role, view) {
    const mark = role === 'forwarder' ? '运' : '货';
    $('#roleIdentity').innerHTML = `<i>${mark}</i><span>${t(`role.${role}`)}<small>${t(`role.${role}Cabinet`)}</small></span><b>✓</b>`;
    $('#profileRole').textContent = t(role === 'client' ? 'role.client' : 'role.forwarderVerified');
    const metadata = authUser?.user_metadata || authSession?.user?.user_metadata || {};
    const profile = authSession?.profile || {};
    const profileName = role === 'forwarder'
      ? (profile.company || metadata.company || profile.full_name || metadata.full_name || 'Dragon Bridge')
      : (profile.full_name || metadata.full_name || 'Иван Новиков'); // i18n-ignore: demo person's name
    const initials = profileName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || (role === 'client' ? '货' : '运');
    $('#profileNameText').textContent = profileName;
    $('#profileInitials').textContent = initials;

    $('#sidebarNav').innerHTML = navigation[role].map((item) => {
      if (item.length === 1) return `<span class="nav-label">${t(`menu.group.${item[0]}`)}</span>`;
      const [key, icon] = item;
      const title = t(`menu.${key}`);
      const count = navCounts(role)[key] || '';
      const active = view === key || (role === 'client' && view === 'request' && key === 'requests') || (role === 'forwarder' && view === 'load' && key === 'loads');
      return `<button class="${active ? 'active' : ''}" data-route="${role}/${key}"><i>${svgIcon(icon)}</i><span>${title}</span>${count ? `<b>${count}</b>` : ''}</button>`;
    }).join('');

    const dockItems = navigation[role].filter((item) => item.length > 1).slice(0, 4);
    $('#mobileDock').innerHTML = dockItems.map(([key, icon]) => {
      const title = t(`menu.${key}`);
      const active = view === key || (view === 'request' && key === 'requests') || (view === 'load' && key === 'loads');
      return `<button class="${active ? 'active' : ''}" data-route="${role}/${key}"><i>${svgIcon(icon)}</i><span>${title}</span></button>`;
    }).join('');
  }

  function heading(role, view, id) {
    if (view === 'request' || view === 'load') {
      const request = findRequest(id);
      return [t('page.request', { id: request?.id || '' }), request ? routeText(request) : ''];
    }
    const known = routeViews[role].includes(view) ? view : 'dashboard';
    return [t(`page.${role}.${known}.title`), t(`page.${role}.${known}.subtitle`)];
  }

  function renderHeading(role, view, id) {
    const [title, subtitle] = heading(role, view, id);
    const section = view === 'dashboard' ? t('page.workspace') : title;
    const actions = role === 'client'
      ? `<button class="button ghost" data-route="client/requests">${t('page.allRequests')}</button><button class="button primary" data-open-wizard>${svgIcon('plus', 16)} ${t('page.createRequest')}</button>`
      : `<button class="button ghost" data-route="forwarder/verification">${t('page.companyProfile')}</button><button class="button dark" data-route="forwarder/loads">${t('page.findLoads')}</button>`;
    $('#pageHeading').innerHTML = `<div><div class="breadcrumbs"><span>HAORU</span><i>/</i><b>${escapeHtml(section)}</b></div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><div class="heading-actions">${actions}</div>`;
  }

  function render() {
    const route = parseRoute();
    const gate = $('#roleGate');
    const workspace = $('#workspace');
    const registeredRole = window.HaoruAuth?.roleFromSession(authSession);
    if (registeredRole && route.role && route.role !== registeredRole) {
      go(window.HaoruAuth.routeForRole(registeredRole));
      return;
    }
    if (registeredRole && route.gate) {
      go(window.HaoruAuth.routeForRole(registeredRole));
      return;
    }
    if (route.gate) {
      gate.hidden = false;
      workspace.hidden = true;
      $('#appSidebar').style.display = 'none';
      $('#mobileDock').innerHTML = '';
      window.HaoruI18n.apply();
      return;
    }
    state.role = route.role;
    document.body.dataset.role = route.role;
    saveState();
    gate.hidden = true;
    workspace.hidden = false;
    $('#appSidebar').style.display = '';
    renderChrome(route.role, route.view);
    renderHeading(route.role, route.view, route.id);
    renderView(route.role, route.view, route.id);
    window.HaoruI18n.apply();
    window.scrollTo(0, 0);
    if (route.role === 'client' && route.view === 'new-request') {
      go('client/requests');
      setTimeout(openRequestWizard, 0);
    }
  }

  function renderView(role, view, id) {
    const root = $('#viewRoot');
    if (role === 'client') {
      if (view === 'dashboard') root.innerHTML = clientDashboard();
      else if (view === 'requests') root.innerHTML = clientRequests();
      else if (view === 'request') root.innerHTML = clientRequestDetail(id);
      else if (view === 'companies') root.innerHTML = companiesView();
      else if (view === 'deals') root.innerHTML = dealsView('client');
      else if (view === 'notifications') root.innerHTML = notificationsView('client');
      else root.innerHTML = clientDashboard();
    } else {
      if (view === 'dashboard') root.innerHTML = forwarderDashboard();
      else if (view === 'loads') root.innerHTML = loadsView();
      else if (view === 'load') root.innerHTML = loadDetail(id);
      else if (view === 'offers') root.innerHTML = myOffersView();
      else if (view === 'verification') root.innerHTML = verificationView();
      else if (view === 'deals') root.innerHTML = dealsView('forwarder');
      else if (view === 'notifications') root.innerHTML = notificationsView('forwarder');
      else root.innerHTML = forwarderDashboard();
    }
  }

  const activeRequests = () => state.requests.filter((request) => request.status === 'active');
  const findRequest = (id) => state.requests.find((request) => request.id === id);
  const allOffers = () => state.requests.flatMap((request) => request.offers.map((offer) => ({ ...offer, request })));
  const myOffers = () => allOffers().filter((offer) => offer.mine);
  const bestOffer = (request) => request.offers.slice().sort((a, b) => a.price - b.price)[0];
  const STATUSES = ['active', 'waiting', 'draft', 'chosen', 'cancelled'];
  const statusLabel = (status) => (STATUSES.includes(status) ? t(`status.${status}`) : status);
  const statusClass = (status) => ({ active: 'active', waiting: 'waiting', draft: 'draft', chosen: 'chosen' })[status] || 'draft';
  const unreadCount = (role) => (state.notificationsRead?.[role] ? 0 : notifications[role]().length);
  // Sidebar badges are computed from the demo state; zero hides the badge.
  const navCounts = (role) => (role === 'client'
    ? { requests: state.requests.length, deals: visibleDeals('client').length, notifications: unreadCount('client') }
    : { loads: activeRequests().length, offers: myOffers().length, deals: visibleDeals('forwarder').length, notifications: unreadCount('forwarder') });

  // A city from the reference in the UI language; otherwise the text as the client typed it.
  const placeName = (request, side) => window.HaoruI18n.cities.name(request?.[`${side}City`]) || request?.[side] || t('common.notSpecified');
  const routeText = (request) => `${placeName(request, 'from')} → ${placeName(request, 'to')}`;

  // Data codes → labels. A value without a dictionary entry (older free text) is shown as is.
  const codeLabel = (key, value) => (!value ? t('common.notSpecified') : window.HaoruI18n.has(key) ? t(key) : value);
  const cargoLabel = (value) => codeLabel(`cargo.${value}`, value);
  const logisticsLabel = (value) => codeLabel(`logistics.${value}`, value);
  const transportLabel = (value) => codeLabel(`transport.${value}`, value);
  const customsLabel = (value) => codeLabel(`customs.${value}`, value);
  const serviceLabel = (value) => codeLabel(`service.${value}`, value);
  const servicesLabel = (values) => (values?.length ? values.map(serviceLabel).join(', ') : '');
  const deliveryLabel = (value) => codeLabel(`dealDelivery.${value}`, value);
  const rating = (value) => (value ? window.HaoruI18n.fmt.number(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '—');
  // Demo offers carry minutes since the update; offers made in the cabinet carry a timestamp.
  const offerAge = (offer) => window.HaoruI18n.fmt.ago(offer.updatedAt ? (Date.now() - offer.updatedAt) / 60000 : offer.updatedAgo);

  // Dates are stored as ISO (yyyy-mm-dd, the wizard's <input type="date">); legacy free text passes through.
  const formatDate = (value) => window.HaoruI18n.fmt.date(value);

  const DURATIONS = [24, 48, 72, 168];
  const durationLabel = (hours) => (DURATIONS.includes(Number(hours)) ? t(`duration.${Number(hours)}`) : t('duration.hours', { count: Number(hours) }));
  // Active auctions first, nearest deadline first; everything else keeps its order after them.
  const endingRank = (request) => (request.status === 'active' ? request.timeLeft : Number.MAX_SAFE_INTEGER);
  const sortByEnding = (list) => list.slice().sort((a, b) => endingRank(a) - endingRank(b));

  function dealOffer(deal) {
    const request = findRequest(deal.requestId);
    return request?.offers.find((offer) => offer.id === request.chosenOfferId);
  }

  // ТЗ §6.3: the deal is confirmed only when both sides confirm; commission is not accrued here (§7.1).
  function dealStatus(deal) {
    const confirmations = deal.confirmations || {};
    if (confirmations.client && confirmations.forwarder) return { label: t('deal.confirmed'), className: 'active', confirmed: true };
    if (confirmations.client || confirmations.forwarder) return { label: t('deal.waitingOther'), className: 'waiting', confirmed: false };
    return { label: t('deal.waiting'), className: 'waiting', confirmed: false };
  }

  const visibleDeals = (role) => (role === 'forwarder' ? state.deals.filter((deal) => dealOffer(deal)?.company === DEMO_FORWARDER) : state.deals);

  function timerLabel(seconds) {
    if (!seconds) return t('timer.closed');
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return t('timer.daysHours', { days, hours: hours % 24 });
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  function routeSignature(request, options = {}) {
    const compact = Boolean(options.compact);
    const fromName = placeName(request, 'from');
    const toName = placeName(request, 'to');
    return `<div class="route-signature${compact ? ' compact' : ''}"><span><b>${escapeHtml(fromName)}</b><small>${t('common.china')}</small></span><i class="route-track"><u></u></i><span><b>${escapeHtml(toName)}</b><small>${t('common.russia')}</small></span></div>`;
  }

  // Weight and volume of a request; «—» for a draft without them.
  const cargoSize = (request) => [
    request.weight ? t('unit.kg', { value: Number(request.weight) }) : '—',
    request.volume ? t('unit.m3', { value: Number(request.volume) }) : '—'
  ].join(' · ');

  function requestRow(request) {
    const best = bestOffer(request);
    const empty = request.status === 'draft' ? t('rq.notPublished') : t('rq.noOffersYet');
    return `<article class="request-row" data-open-request="${escapeHtml(request.id)}" tabindex="0">
      <div class="route-cell"><i class="route-icon">${svgIcon(request.status === 'draft' ? 'file' : 'route', 17)}</i><span><b>${escapeHtml(routeText(request))}</b><small>${escapeHtml(cargoLabel(request.category))} · ${escapeHtml(cargoSize(request))}</small></span></div>
      <div class="request-meta"><small>${t('rq.status')}</small><span class="status ${statusClass(request.status)}">${escapeHtml(statusLabel(request.status))}</span></div>
      <div class="request-price"><small>${t(best ? 'rq.bestPrice' : 'rq.offers')}</small><b>${best ? money(best.price, best.currency) : escapeHtml(empty)}</b></div>
      <div class="request-time"><small>${t(request.status === 'active' ? 'rq.closesIn' : 'rq.offerCount')}</small><b>${request.status === 'active' ? timerLabel(request.timeLeft) : request.offers.length}</b></div>
      <button class="row-arrow" aria-label="${escapeHtml(t('common.open'))}">${svgIcon('arrow', 17)}</button>
    </article>`;
  }

  // System events of the demo account: [icon, title key, details, minutes ago].
  const clientActivity = () => [
    ['trend', t('activity.priceDropped', { company: 'Dragon Bridge' }), `HR-1048 · ${money(186000, 'RUB')}`, 12],
    ['bid', t('activity.newOffer'), t('activity.answered', { company: 'EastRail', id: 'HR-1051' }), 18],
    ['clock', t('activity.auctionClosed'), t('activity.awaitingChoice', { id: 'HR-1039' }), 60]
  ];
  const activityItems = (items) => items.map(([icon, title, details, minutes]) => `<div class="activity-item"><i>${svgIcon(icon, 17)}</i><span><b>${escapeHtml(title)}</b><small>${escapeHtml(details)}</small></span><time>${escapeHtml(typeof minutes === 'number' ? window.HaoruI18n.fmt.ago(minutes, 'short') : minutes)}</time></div>`).join('');

  function clientDashboard() {
    const active = activeRequests();
    const waiting = state.requests.filter((request) => request.status === 'waiting').length;
    const drafts = state.requests.filter((request) => request.status === 'draft').length;
    const newOffers = active.reduce((sum, request) => sum + request.offers.length, 0);
    const decision = state.requests.find((request) => request.status === 'waiting') || active[0];
    const decisionTitle = decision?.status === 'waiting' ? t('dash.compareOffers', { count: decision.offers.length }) : t('dash.checkAuction');
    return `<div class="overview-band">
      <section class="metric-strip" aria-label="${escapeHtml(t('dash.summary'))}"><article><small>${t('dash.activeAuctions')}</small><b>${active.length}</b><em>${t('dash.requestsOpen')}</em></article><article><small>${t('dash.offers')}</small><b>${newOffers}</b><em>${t('dash.inAuctions')}</em></article><article><small>${t('dash.needDecision')}</small><b>${waiting}</b><em>${t('dash.drafts', { count: drafts })}</em></article></section>
      <article class="attention-card"><div class="attention-copy"><span>${t('dash.nextAction')}</span><h2>${escapeHtml(decisionTitle)}</h2><p>${escapeHtml(decision?.id || 'HR-1048')} · ${escapeHtml(decision ? cargoLabel(decision.category) : t('dash.transportRequest'))}</p></div>${decision ? routeSignature(decision, { compact: true }) : ''}<button class="button primary" data-open-request="${escapeHtml(decision?.id || 'HR-1048')}">${t('common.open')} ${svgIcon('arrow', 16)}</button></article>
    </div>
    <div class="workspace-grid">
      <section class="panel table-panel dashboard-table"><div class="panel-head"><div><h2>${t('dash.activeRequests')}</h2><p>${t('dash.activeRequestsText')}</p></div><button data-route="client/requests">${t('page.allRequests')} ${svgIcon('arrow', 15)}</button></div><div class="request-list-head"><span>${t('rq.routeCargo')}</span><span>${t('rq.status')}</span><span>${t('rq.bestPrice')}</span><span>${t('rq.closesIn')}</span><span></span></div><div class="request-list">${active.slice(0, 4).map(requestRow).join('')}</div></section>
      <aside class="work-rail"><section class="panel activity-panel"><div class="panel-head"><div><h2>${t('dash.recentEvents')}</h2><p>${t('common.today')}</p></div></div><div class="activity-list">${activityItems(clientActivity())}</div></section>
      <section class="panel action-panel"><div class="panel-head"><div><h2>${t('dash.quickActions')}</h2><p>${t('dash.quickActionsText')}</p></div></div><div class="quick-actions"><button class="quick-action" data-open-wizard><i>${svgIcon('plus')}</i><span><b>${t('page.createRequest')}</b><small>${t('dash.createRequestText')}</small></span><span>${svgIcon('arrow', 16)}</span></button><button class="quick-action" data-route="client/companies"><i>${svgIcon('building')}</i><span><b>${t('dash.catalog')}</b><small>${t('dash.catalogText')}</small></span><span>${svgIcon('arrow', 16)}</span></button></div></section></aside>
    </div>`;
  }

  function clientRequests() {
    const destinations = placeOptions(state.requests.filter((request) => request.to || request.toCity), 'to');
    return `<section class="panel table-panel data-panel"><div class="panel-head"><div><h2>${t('page.allRequests')}</h2><p id="requestResultCount">${t('rq.shown', { count: state.requests.length })}</p></div><button data-open-wizard>${svgIcon('plus', 15)} ${t('rq.newRequest')}</button></div><form class="filters compact" id="requestFilters"><label class="search-field"><span>${t('rq.search')}</span><input name="query" placeholder="${escapeHtml(t('rq.searchHint'))}"></label><label><span>${t('rq.status')}</span><select name="status"><option value="all">${t('rq.allStatuses')}</option><option value="active">${t('rq.filterActive')}</option><option value="waiting">${t('rq.filterWaiting')}</option><option value="draft">${t('rq.filterDrafts')}</option><option value="chosen">${t('status.chosen')}</option></select></label><label><span>${t('rq.destination')}</span><select name="route"><option value="all">${t('rq.allDestinations')}</option>${destinations}</select></label><label><span>${t('rq.sort')}</span><select name="sort"><option value="new">${t('rq.sortNew')}</option><option value="ending">${t('rq.sortEnding')}</option></select></label><button class="button dark" type="submit">${t('rq.apply')}</button></form><div class="request-list-head"><span>${t('rq.routeCargo')}</span><span>${t('rq.status')}</span><span>${t('rq.price')}</span><span>${t('rq.auction')}</span><span></span></div><div class="request-list" id="requestList">${state.requests.map(requestRow).join('')}</div></section>`;
  }

  function detailHero(request) {
    const best = bestOffer(request);
    const chips = [
      request.weight ? t('unit.kg', { value: Number(request.weight) }) : '—', request.volume ? t('unit.m3', { value: Number(request.volume) }) : '—',
      cargoLabel(request.category), logisticsLabel(request.logistics), transportLabel(request.transport)
    ];
    return `<section class="detail-hero"><div class="detail-top"><span class="status ${statusClass(request.status)}">${escapeHtml(statusLabel(request.status))}</span><small>${escapeHtml(request.id)}</small></div>${routeSignature(request)}<div class="detail-chips">${chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join('')}</div><div class="detail-stats"><span><small>${t('rq.bestPrice')}</small><b>${best ? money(best.price, best.currency) : escapeHtml(t('rq.noOffersYet'))}</b></span><span><small>${t('rq.offerCount')}</small><b>${request.offers.length}</b></span><span><small>${t(request.status === 'active' ? 'rq.closesIn' : 'rq.status')}</small><b>${request.status === 'active' ? timerLabel(request.timeLeft) : escapeHtml(statusLabel(request.status))}</b></span></div></section>`;
  }

  function infoCard(request) {
    const rows = [
      ['detail.ready', escapeHtml(formatDate(request.ready))], ['detail.places', escapeHtml(request.places || '—')],
      ['detail.logistics', escapeHtml(logisticsLabel(request.logistics))], ['detail.transport', escapeHtml(transportLabel(request.transport))],
      ['detail.services', escapeHtml(servicesLabel(request.services) || t('common.notSpecified'))]
    ];
    return `<article class="info-card"><h3>${t('detail.cargoTitle')}</h3><div class="info-list">${rows.map(([label, value]) => `<div><span>${t(label)}</span><b>${value}</b></div>`).join('')}<div><span>${t('detail.comment')}</span><b translate="no">${escapeHtml(request.details || '—')}</b></div></div></article>`;
  }

  function offerRows(request, anonymized = false) {
    if (!request.offers.length) return `<div class="empty-state"><span>价</span><h2>${t('offers.emptyTitle')}</h2><p>${t('offers.emptyText')}</p></div>`;
    const ordered = request.offers.slice().sort((a, b) => a.price - b.price);
    const open = request.status === 'active' || request.status === 'waiting';
    return `<div class="offers-table"><div class="offer-row head"><span>${t('offers.company')}</span><span>${t('offers.price')}</span><span>${t('offers.term')}</span><span>${t('offers.transport')}</span><span>${t('offers.terms')}</span><span></span></div>${ordered.map((offer, index) => {
      // ТЗ: competing forwarders see each other anonymized; the owner sees company names.
      const label = anonymized && !offer.mine ? t('offers.anonymous', { n: index + 1 }) : offer.company;
      const mark = anonymized && !offer.mine ? '匿' : offer.mark;
      const badges = [t(offer.verified ? 'offers.verified' : 'offers.hidden'), ...(index === 0 ? [t('offers.lowest')] : [])].join(' · ');
      const action = anonymized
        ? `<button class="button ghost small" ${offer.mine ? `data-open-bid="${escapeHtml(request.id)}"` : 'disabled'}>${t(offer.mine ? 'offers.edit' : 'offers.anonymousButton')}</button>`
        : `<button class="button ${open ? 'dark' : 'ghost'} small" ${open ? `data-choose-offer="${escapeHtml(request.id)}:${escapeHtml(offer.id)}"` : 'disabled'}>${t(request.status === 'chosen' && request.chosenOfferId === offer.id ? 'offers.chosen' : 'offers.choose')}</button>`;
      return `<article class="offer-row ${index === 0 ? 'best' : ''}"><div class="company-cell"><i class="company-logo">${escapeHtml(mark)}</i><span><b>${escapeHtml(label)}${offer.mine ? escapeHtml(t('offers.you')) : ''}</b><small>${escapeHtml(badges)}</small></span></div><span><b>${money(offer.price, offer.currency)}</b><small>${escapeHtml(offerAge(offer))}</small></span><span><b>${escapeHtml(t('unit.days', { count: Number(offer.days) }))}</b><small>${t('offers.estimated')}</small></span><span><b>${escapeHtml(transportLabel(offer.transport))}</b><small>${escapeHtml(customsLabel(offer.customs))}</small></span><span><b>${escapeHtml(servicesLabel(offer.services))}</b>${offer.comment ? `<small class="offer-comment" translate="no">${escapeHtml(offer.comment)}</small>` : `<small class="offer-comment">${t('offers.noComment')}</small>`}</span>${action}</article>`;
    }).join('')}</div>`;
  }

  function clientRequestDetail(id) {
    const request = findRequest(id);
    if (!request) return notFound(t('detail.notFoundTitle'), t('detail.notFoundText'), 'client/requests');
    const chosen = request.offers.find((offer) => offer.id === request.chosenOfferId);
    const deal = state.deals.find((item) => item.requestId === request.id);
    const contacts = chosen
      ? `<article class="info-card"><h3>${t('detail.chosenTitle')}</h3><div class="company-cell"><i class="company-logo">${escapeHtml(chosen.mark)}</i><span><b>${escapeHtml(chosen.company)}</b><small>${t('detail.contactsOpen')}</small></span></div><div class="info-list spaced"><div><span>WeChat</span><b>dragonbridge_cn</b></div><div><span>${t('detail.phone')}</span><b>+86 138 *** 5688</b></div><div><span>${t('detail.deal')}</span><b>${escapeHtml(deal ? dealStatus(deal).label : t('deal.waiting'))}</b></div></div><button class="button dark block" data-route="client/deals">${t('detail.openDeal')}</button></article>`
      : `<article class="info-card"><h3>${t('detail.contactsTitle')}</h3><p>${t('detail.contactsText')}</p></article>`;
    return `<div class="request-page"><div>${detailHero(request)}<div class="offer-toolbar"><div><h2>${t('detail.offersTitle')}</h2><p>${t('detail.offersText')}</p></div>${SHOW_OFFER_VIEW_TOGGLE ? `<div class="view-toggle"><button class="active">${t('detail.viewTable')}</button><button>${t('detail.viewCards')}</button></div>` : ''}</div>${offerRows(request)}</div><aside class="detail-side">${infoCard(request)}${contacts}</aside></div>`;
  }

  function companyRow(company) {
    return `<article class="company-row"><div class="company-cell"><i class="company-logo">${escapeHtml(company.mark)}</i><span><b>${escapeHtml(company.name)}</b><small>${escapeHtml(t('companies.place', { city: window.HaoruI18n.cities.name(company.city) }))}</small></span></div><span class="company-services">${escapeHtml(company.spec.map((key) => t(key)).join(' · '))}</span><b>${escapeHtml(rating(company.rating))}</b><b>${escapeHtml(window.HaoruI18n.fmt.number(company.deals))}</b><button class="button ghost small" data-action="company-profile">${t('companies.profile')} ${svgIcon('arrow', 15)}</button></article>`;
  }

  function companiesView() {
    const options = (values, label) => values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(label(value))}</option>`).join('');
    const cities = [...new Set(companies.map((company) => company.city))];
    const cityOption = (id) => window.HaoruI18n.cities.name(id);
    return `<section class="panel table-panel data-panel"><div class="panel-head"><div><h2>${t('companies.title')}</h2><p id="companyResultCount">${t('companies.count', { count: companies.length })}</p></div></div><form class="filters compact" id="companyFilters"><label><span>${t('companies.city')}</span><select name="city"><option value="all">${t('companies.allChina')}</option>${options(cities, cityOption)}</select></label><label><span>${t('companies.logistics')}</span><select name="logistics"><option value="all">${t('companies.anyLogistics')}</option>${options(['cargo', 'official'], logisticsLabel)}</select></label><label><span>${t('companies.transport')}</span><select name="transport"><option value="all">${t('companies.anyTransport')}</option>${options(['road', 'rail', 'sea', 'air'], transportLabel)}</select></label><label><span>${t('companies.services')}</span><select name="services"><option value="all">${t('companies.anyServices')}</option>${options(['customs', 'insurance', 'door'], serviceLabel)}</select></label><button class="button dark" type="submit">${t('companies.find')}</button></form><div class="company-list-head"><span>${t('offers.company')}</span><span>${t('companies.spec')}</span><span>${t('companies.rating')}</span><span>${t('companies.deals')}</span><span></span></div><div class="company-list" id="companyList">${companies.map(companyRow).join('')}</div></section>`;
  }

  function dealsView(role) {
    const deals = visibleDeals(role);
    if (!deals.length) return notFound(t('deals.emptyTitle'), t('deals.emptyText'), `${role}/dashboard`);
    return `<div class="request-list">${deals.map((deal) => {
      const request = findRequest(deal.requestId);
      const offer = dealOffer(deal);
      const status = dealStatus(deal);
      const confirmButton = status.confirmed ? ''
        : deal.confirmations?.[role] ? `<button class="button ghost" disabled>${t('deals.youConfirmed')}</button>`
        : `<button class="button dark" data-action="confirm-deal" data-deal-id="${escapeHtml(deal.id)}">${t('deals.confirm')}</button>`;
      return `<article class="panel"><div class="panel-head"><div><h2>${escapeHtml(deal.id)} · ${escapeHtml(routeText(request))}</h2><p>${escapeHtml(t('deals.request', { id: deal.requestId }))}</p></div><span class="status ${status.className}">${escapeHtml(status.label)}</span></div><div class="detail-stats on-light"><span><small>${t('deals.forwarder')}</small><b>${escapeHtml(offer?.company || t('deals.notChosen'))}</b></span><span><small>${t('deals.total')}</small><b>${offer ? money(offer.price,offer.currency) : '—'}</b></span><span><small>${t('deals.delivery')}</small><b>${escapeHtml(deliveryLabel(deal.delivery))}</b></span></div><div class="heading-actions deal-actions">${confirmButton}<button class="button ghost" data-action="deal-details">${t('deals.details')}</button></div></article>`;
    }).join('')}</div>`;
  }

  function notificationsView(role) {
    const read = Boolean(state.notificationsRead?.[role]);
    const button = read ? `<button disabled>${t('notif.allRead')}</button>` : `<button data-action="read-all">${t('notif.readAll')}</button>`;
    return `<section class="panel"><div class="panel-head"><div><h2>${t('notif.title')}</h2><p>${t('notif.text')}</p></div>${button}</div><div class="activity-list on-light">${notifications[role]().map(([mark, title, details, minutes]) => `<div class="activity-item${read ? '' : ' unread'}"><i>${mark}</i><span><b>${escapeHtml(title)}</b><small>${escapeHtml(details)}</small></span><time>${escapeHtml(window.HaoruI18n.fmt.ago(minutes))}</time></div>`).join('')}</div></section>`;
  }

  // Exchange events of the demo forwarder: [icon, title, details, minutes ago or a ready label].
  function forwarderActivity() {
    const invited = findRequest('HR-1051');
    const sources = ['guangzhou', 'yiwu', 'shenzhen'].map((id) => window.HaoruI18n.cities.name(id));
    return [
      ['clipboard', t('activity.newLoads', { count: 4 }), window.HaoruI18n.fmt.list(sources), t('common.todayLower')],
      ['bell', t('activity.invitation'), invited ? `${cargoLabel(invited.category)} · ${routeText(invited)}` : '', 8],
      ['bid', t('activity.bestBidChanged'), t('activity.bidderHidden', { id: 'HR-1048' }), 12]
    ];
  }

  function forwarderDashboard() {
    const matching = activeRequests();
    const mine = myOffers();
    const invited = matching.find((item) => item.id === 'HR-1051') || matching[0];
    const invitationCount = matching.some((item) => item.id === 'HR-1051') ? 1 : 0;
    return `<div class="overview-band"><section class="metric-strip" aria-label="${escapeHtml(t('dash.summary'))}"><article><small>${t('fdash.matching')}</small><b>${matching.length}</b><em>${t('fdash.openForBids')}</em></article><article><small>${t('fdash.activeOffers')}</small><b>${mine.length}</b><em>${t('fdash.currentBids')}</em></article><article><small>${t('fdash.invitations')}</small><b>${invitationCount}</b><em>${t('fdash.needReply')}</em></article></section><article class="attention-card"><div class="attention-copy"><span>${t('activity.invitation')}</span><h2>${t(invited ? 'fdash.offerTerms' : 'fdash.checkLoads')}</h2><p>${escapeHtml(invited?.id || t('menu.loads'))} · ${escapeHtml(invited ? cargoLabel(invited.category) : t('loads.title'))}</p></div>${invited ? routeSignature(invited, { compact: true }) : ''}<button class="button primary" ${invited ? `data-open-bid="${escapeHtml(invited.id)}"` : 'data-route="forwarder/loads"'}>${t('fdash.reply')} ${svgIcon('arrow', 16)}</button></article></div>
      <div class="workspace-grid"><section class="panel table-panel dashboard-table"><div class="panel-head"><div><h2>${t('fdash.matching')}</h2><p>${escapeHtml(t('fdash.matchingText', { company: DEMO_FORWARDER }))}</p></div><button data-route="forwarder/loads">${t('fdash.allLoads')} ${svgIcon('arrow', 15)}</button></div>${loadListHead()}<div class="load-table">${matching.slice(0,3).map(loadTableRow).join('')}</div></section><aside class="work-rail"><section class="panel activity-panel"><div class="panel-head"><div><h2>${t('fdash.events')}</h2><p>${t('common.today')}</p></div></div><div class="activity-list">${activityItems(forwarderActivity())}</div></section><section class="panel company-status"><div class="panel-head"><div><h2>${escapeHtml(DEMO_FORWARDER)}</h2><p>${t('fdash.companyStatus')}</p></div><span class="status active">${t('fdash.verified')}</span></div><div class="info-list"><div><span>${t('fdash.access')}</span><b>${t('fdash.accessFull')}</b></div><div><span>${t('fdash.activeVariants')}</span><b>${escapeHtml(t('common.usedOf', { used: mine.length || 2, max: 3 }))}</b></div></div><button class="button ghost" data-route="forwarder/verification">${t('page.companyProfile')} ${svgIcon('arrow', 15)}</button></section></aside></div>`;
  }

  const loadListHead = () => `<div class="load-list-head"><span>${t('loads.route')}</span><span>${t('loads.cargo')}</span><span>${t('detail.ready')}</span><span>${t('rq.bestPrice')}</span><span>${t('rq.closesIn')}</span><span></span></div>`;

  function loadTableRow(request) {
    const best = bestOffer(request);
    return `<article class="load-row" data-open-load="${escapeHtml(request.id)}" tabindex="0"><div>${routeSignature(request, { compact: true })}<small>${escapeHtml(request.id)}${request.id === 'HR-1051' ? escapeHtml(t('loads.invited')) : ''}</small></div><span><b>${escapeHtml(cargoLabel(request.category))}</b><small>${escapeHtml(cargoSize(request))}</small></span><span><b>${escapeHtml(formatDate(request.ready))}</b><small>${escapeHtml(logisticsLabel(request.logistics))}</small></span><span><b>${best ? money(best.price,best.currency) : escapeHtml(t('loads.noBids'))}</b><small>${escapeHtml(t('loads.offersShort', { count: request.offers.length }))}</small></span><span><b>${timerLabel(request.timeLeft)}</b><small>${escapeHtml(transportLabel(request.transport))}</small></span><button class="button ghost small" data-open-bid="${escapeHtml(request.id)}">${t('loads.bid')}</button></article>`;
  }

  // Filter value for a route end: the city id, or the typed text for a city outside the reference.
  const placeKey = (request, side) => request[`${side}City`] || `text:${request[side]}`;
  const placeOptions = (list, side) => [...new Map(list.map((request) => [placeKey(request, side), placeName(request, side)])).entries()]
    .map(([value, name]) => `<option value="${escapeHtml(value)}">${escapeHtml(name)}</option>`).join('');

  function loadsView() {
    const loads = activeRequests();
    return `<section class="panel table-panel data-panel"><div class="panel-head"><div><h2>${t('loads.title')}</h2><p>${escapeHtml(t('loads.count', { count: loads.length }))}</p></div></div><form class="filters compact" id="loadFilters"><label><span>${t('loads.from')}</span><select name="from"><option value="all">${t('companies.allChina')}</option>${placeOptions(loads, 'from')}</select></label><label><span>${t('rq.destination')}</span><select name="to"><option value="all">${t('loads.allRussia')}</option>${placeOptions(loads, 'to')}</select></label><label><span>${t('detail.logistics')}</span><select name="logistics"><option value="all">${t('companies.anyLogistics')}</option><option value="cargo">${escapeHtml(logisticsLabel('cargo'))}</option><option value="official">${escapeHtml(logisticsLabel('official'))}</option></select></label><label><span>${t('rq.sort')}</span><select name="sort"><option value="new">${t('rq.sortNew')}</option><option value="ending">${t('loads.sortEnding')}</option><option value="weight">${t('loads.sortWeight')}</option></select></label><button class="button dark" type="submit">${t('companies.find')}</button></form>${loadListHead()}<div class="load-table" id="loadGrid">${loads.map(loadTableRow).join('')}</div></section>`;
  }

  function loadDetail(id) {
    const request = findRequest(id);
    if (!request) return notFound(t('loads.notFoundTitle'), t('loads.notFoundText'), 'forwarder/loads');
    const used = request.offers.filter((offer) => offer.mine).length;
    return `<div class="load-detail"><div>${detailHero(request)}<div class="offer-toolbar"><div><h2>${t('loads.competitorsTitle')}</h2><p>${t('loads.competitorsText')}</p></div><button class="button primary" data-open-bid="${escapeHtml(request.id)}">${t('loads.makeBid')}</button></div>${offerRows(request,true)}</div><aside class="detail-side">${infoCard(request)}<article class="info-card"><h3>${t('loads.rulesTitle')}</h3><div class="info-list"><div><span>${t('loads.yourVariants')}</span><b>${escapeHtml(t('common.usedOf', { used, max: 3 }))}</b></div><div><span>${t('loads.bidChange')}</span><b>${t(request.status === 'active' ? 'loads.untilClose' : 'loads.closed')}</b></div><div><span>${t('loads.clientContacts')}</span><b>${t('loads.hidden')}</b></div></div><button class="button dark block" data-open-bid="${escapeHtml(request.id)}">${t('bid.submit')}</button></article></aside></div>`;
  }

  function myOffersView() {
    const offers = myOffers();
    if (!offers.length) return `<div class="empty-state"><span>价</span><h2>${t('myOffers.emptyTitle')}</h2><p>${t('myOffers.emptyText')}</p><button class="button primary" data-route="forwarder/loads">${t('myOffers.toLoads')}</button></div>`;
    return `<div class="offer-list">${offers.map((offer) => `<article class="my-offer"><div><b>${escapeHtml(routeText(offer.request))}</b><small>${escapeHtml(offer.request.id)} · ${escapeHtml(cargoLabel(offer.request.category))}</small></div><span><small>${t('myOffers.yourPrice')}</small><b>${money(offer.price,offer.currency)}</b></span><span><small>${t('offers.term')}</small><b>${escapeHtml(t('unit.days', { count: Number(offer.days) }))}</b></span><span><small>${t('rq.status')}</small><b class="status active">${t('myOffers.active')}</b></span><span><small>${t('myOffers.change')}</small><b>${t('myOffers.changeNow')}</b></span><button class="button ghost small" data-open-bid="${escapeHtml(offer.request.id)}">${t('offers.edit')}</button></article>`).join('')}</div>`;
  }

  function verificationView() {
    const steps = [['company', 'filled'], ['documents', 'checked'], ['contact', 'confirmed'], ['services', 'published']];
    const profileTags = ['logistics.cargo', 'logistics.official', 'transport.road', 'transport.rail', 'transport.sea', 'service.customs', 'service.door'];
    const capabilities = [['verify.viewRequests', t('verify.available')], ['verify.sendBids', t('verify.available')], ['verify.employees', window.HaoruI18n.fmt.number(3)], ['verify.plan', t('verify.planValue')]];
    // The Chinese legal name is registration data and is shown as registered, in every language.
    return `<div class="verification-layout"><section class="verification-card"><div class="verification-head"><span>验</span><div><h2>Dragon Bridge Logistics Co., Ltd.</h2><p>广州龙桥国际物流有限公司 · ${escapeHtml(t('verify.place', { city: window.HaoruI18n.cities.name('guangzhou') }))}</p></div><span class="status active push-right">${t('fdash.verified')}</span></div><div class="verification-steps">${steps.map(([step, result]) => `<div class="verification-step done"><i>✓</i><span><b>${t(`verify.step.${step}`)}</b><small>${t(`verify.step.${step}Text`)}</small></span><em>${t(`verify.result.${result}`)}</em></div>`).join('')}</div></section><aside class="detail-side"><article class="info-card"><h3>${t('verify.capabilities')}</h3><div class="info-list">${capabilities.map(([label, value]) => `<div><span>${t(label)}</span><b>${escapeHtml(value)}</b></div>`).join('')}</div></article><article class="info-card"><h3>${t('verify.servicesTitle')}</h3><div class="load-tags">${profileTags.map((key) => `<span>${t(key)}</span>`).join('')}</div><button class="button ghost block" data-action="edit-profile">${t('verify.edit')}</button></article></aside></div>`;
  }

  function notFound(title, text, route) {
    return `<div class="empty-state"><span>路</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p><button class="button primary" data-route="${route}">${t('common.goBack')}</button></div>`;
  }

  function openRequestWizard() {
    wizardStep = 1;
    const form = $('#requestWizardForm');
    form.reset();
    selectedCargoFile = null;
    if (cargoPreviewUrl) URL.revokeObjectURL(cargoPreviewUrl);
    cargoPreviewUrl = null;
    $('#cargoPhotoCopy').hidden = false;
    $('#cargoPhotoPreview').hidden = true;
    $('#cargoPhotoPreview').innerHTML = '';
    form.elements.from.value = window.HaoruI18n.cities.name('guangzhou');
    form.elements.to.value = window.HaoruI18n.cities.name('moscow');
    fillCityLists();
    form.elements.weight.value = 420;
    form.elements.volume.value = 2.4;
    form.elements.places.value = 12;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    form.elements.ready.value = date.toISOString().slice(0, 10);
    updateWizard();
    openModal($('#requestWizard'));
  }

  // Suggestions for the route fields in the UI language; any other city can still be typed.
  function fillCityLists() {
    [['citiesCN', 'CN'], ['citiesRU', 'RU']].forEach(([id, country]) => {
      $(`#${id}`).innerHTML = window.HaoruI18n.cities.list(country).map((city) => `<option value="${escapeHtml(window.HaoruI18n.cities.name(city.id))}"></option>`).join('');
    });
  }

  function selectCargoPhoto(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      $('#cargoPhotoInput').value = '';
      showToast('fileTooLarge');
      return;
    }
    selectedCargoFile = file;
    if (cargoPreviewUrl) URL.revokeObjectURL(cargoPreviewUrl);
    cargoPreviewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    $('#cargoPhotoCopy').hidden = true;
    const preview = $('#cargoPhotoPreview');
    preview.hidden = false;
    preview.innerHTML = `${cargoPreviewUrl ? `<img src="${cargoPreviewUrl}" alt="">` : '<i>PDF</i>'}<span><b translate="no">${escapeHtml(file.name)}</b><small>${tHtml('wizard.photoSelected', { size: window.HaoruI18n.fmt.number(file.size / 1024 / 1024, { maximumFractionDigits: 1 }) })}</small></span>`;
  }

  function updateWizard() {
    $$('.wizard-step').forEach((step) => { step.hidden = Number(step.dataset.step) !== wizardStep; });
    const progress = $$('.wizard-progress>span');
    const lines = $$('.wizard-progress>i');
    progress.forEach((item, index) => {
      item.classList.toggle('active', index + 1 === wizardStep);
      item.classList.toggle('done', index + 1 < wizardStep);
    });
    lines.forEach((line, index) => line.classList.toggle('done', index + 1 < wizardStep));
    $('#wizardBack').hidden = wizardStep === 1;
    $('#wizardNext').hidden = wizardStep === 3;
    $('#wizardPublish').hidden = wizardStep !== 3;
    if (wizardStep === 3) updateReview();
  }

  function requestFormData() {
    const form = $('#requestWizardForm');
    const data = Object.fromEntries(new FormData(form));
    data.services = new FormData(form).getAll('services');
    return data;
  }

  function updateReview() {
    const data = requestFormData();
    $('#requestReview').innerHTML = [
      ['review.route', `${data.from} → ${data.to}`], ['review.cargo', `${cargoLabel(data.category)} · ${t('unit.kg', { value: Number(data.weight) })} · ${t('unit.m3', { value: Number(data.volume) })}`],
      ['review.ready', formatDate(data.ready)], ['review.logistics', `${logisticsLabel(data.logistics)} · ${transportLabel(data.transport)}`],
      ['review.budget', data.budget ? window.HaoruI18n.fmt.money(data.budget, data.currency) : t('review.noBudget')],
      ['review.auction', durationLabel(data.auctionDuration)]
    ].map(([label, value]) => `<div><small>${t(label)}</small><b>${escapeHtml(value)}</b></div>`).join('');
  }

  function validateWizardStep() {
    const current = $(`.wizard-step[data-step="${wizardStep}"]`);
    const fields = $$('input,select,textarea', current);
    for (const field of fields) if (!field.reportValidity()) return false;
    return true;
  }

  const routeFields = (data) => {
    const from = (data.from || '').trim();
    const to = (data.to || '').trim();
    return { from, fromCity: window.HaoruI18n.cities.find(from)?.id || null, to, toCity: window.HaoruI18n.cities.find(to)?.id || null };
  };

  async function publishRequest(event) {
    event.preventDefault();
    if (!validateWizardStep()) return;
    const data = requestFormData();
    const id = `HR-${state.requestCounter++}`;
    const request = {
      id, status: 'active', ...routeFields(data),
      category: data.category, weight: Number(data.weight), volume: Number(data.volume), places: Number(data.places || 0),
      ready: data.ready, logistics: data.logistics, transport: data.transport, auctionDuration: Number(data.auctionDuration),
      timeLeft: Number(data.auctionDuration) * 3600, budget: Number(data.budget || 0), currency: data.currency,
      services: data.services, details: data.details || '', offers: [], photoName: selectedCargoFile?.name || null
    };
    if (selectedCargoFile && window.HaoruAuth?.isConfigured) {
      const publishButton = $('#wizardPublish');
      publishButton.disabled = true;
      publishButton.textContent = t('wizard.uploading');
      try {
        const upload = await window.HaoruAuth.uploadCargoPhoto(selectedCargoFile, id);
        request.photoPath = upload.path;
      } catch (error) {
        publishButton.disabled = false;
        publishButton.textContent = t('wizard.publish');
        showToast('photoFailed', { error: error.message });
        state.requestCounter -= 1;
        return;
      }
      publishButton.disabled = false;
      publishButton.textContent = t('wizard.publish');
    }
    state.requests.unshift(request);
    saveState();
    closeOverlays();
    showToast('requestPublished', { id });
    go(`client/request/${id}`);
  }

  function saveDraft() {
    const data = requestFormData();
    const id = `DRAFT-${Date.now().toString().slice(-5)}`;
    state.requests.unshift({ id, status: 'draft', ...routeFields(data), category: data.category || '', weight: Number(data.weight || 0), volume: Number(data.volume || 0), places: Number(data.places || 0), ready: data.ready || '', logistics: data.logistics || 'cargo', transport: data.transport || 'any', auctionDuration: Number(data.auctionDuration || 48), timeLeft: 0, budget: Number(data.budget || 0), currency: data.currency || 'RUB', services: data.services || [], details: data.details || '', offers: [] });
    saveState();
    closeOverlays();
    showToast('draftSaved');
    go('client/requests');
  }

  function openBidModal(requestId) {
    const request = findRequest(requestId);
    if (!request) return;
    selectedLoadId = requestId;
    const myExisting = request.offers.find((offer) => offer.mine);
    $('#selectedLoadSummary').innerHTML = `<b>${escapeHtml(routeText(request))}</b><small>${escapeHtml(request.id)} · ${tHtml('unit.kg', { value: Number(request.weight) })} · ${tHtml('unit.m3', { value: Number(request.volume) })} · ${escapeHtml(cargoLabel(request.category))}</small>`;
    const form = $('#bidForm');
    form.reset();
    form.elements.price.value = myExisting?.price || Math.max(1, Math.round((bestOffer(request)?.price || request.budget || 190000) * .97));
    form.elements.currency.value = myExisting?.currency || bestOffer(request)?.currency || request.currency;
    form.elements.days.value = myExisting?.days || 17;
    if (myExisting) {
      form.elements.transport.value = myExisting.transport;
      form.elements.customs.value = myExisting.customs;
      form.elements.comment.value = myExisting.comment || '';
    }
    openModal($('#bidModal'));
  }

  function submitBid(event) {
    event.preventDefault();
    const request = findRequest(selectedLoadId);
    if (!request) return;
    const form = event.target;
    const data = Object.fromEntries(new FormData(form));
    const services = new FormData(form).getAll('bidServices');
    const existing = request.offers.find((offer) => offer.mine);
    const payload = { company: 'Dragon Bridge', mark: '龙', verified: true, rating: 4.9, price: Number(data.price), currency: data.currency, days: Number(data.days), transport: data.transport, customs: data.customs, services, comment: data.comment || '', updatedAt: Date.now(), mine: true };
    if (existing) Object.assign(existing, payload);
    else request.offers.push({ id: `OF-${Date.now().toString().slice(-6)}`, ...payload });
    saveState();
    closeOverlays();
    showToast(existing ? 'bidUpdated' : 'bidSent', { price: money(payload.price, payload.currency), term: t('unit.days', { count: payload.days }) });
    go('forwarder/offers');
  }

  function openConfirm(requestId, offerId) {
    const request = findRequest(requestId);
    const offer = request?.offers.find((item) => item.id === offerId);
    if (!request || !offer) return;
    selectedOffer = { requestId, offerId };
    $('#confirmOfferSummary').innerHTML = `<div class="confirm-offer"><div><small>${t('confirm.company')}</small><b translate="no">${escapeHtml(offer.company)}</b></div><div><small>${t('confirm.price')}</small><b>${money(offer.price,offer.currency)}</b></div><div><small>${t('confirm.term')}</small><b>${tHtml('unit.days', { count: Number(offer.days) })}</b></div><div><small>${t('confirm.route')}</small><b>${escapeHtml(routeText(request))}</b></div></div>`;
    openModal($('#confirmModal'));
  }

  function confirmChoose() {
    if (!selectedOffer) return;
    const request = findRequest(selectedOffer.requestId);
    if (!request) return;
    request.status = 'chosen';
    request.chosenOfferId = selectedOffer.offerId;
    request.timeLeft = 0;
    if (!state.deals.some((deal) => deal.requestId === request.id)) {
      state.deals.unshift({ id: `DL-${204 + state.deals.length}`, requestId: request.id, delivery: 'preparing', contactsOpen: true });
    }
    saveState();
    closeOverlays();
    showToast('forwarderChosen');
    render();
  }

  // The request number, the typed route and the city names in every language.
  function searchText(request) {
    const names = ['from', 'to'].flatMap((side) => {
      const city = window.HaoruI18n.cities.byId(request[`${side}City`]);
      return [request[side], city?.ru, city?.zh, city?.en];
    });
    return [request.id, ...names].filter(Boolean).join(' ').toLowerCase();
  }

  function filterRequests(form) {
    const data = Object.fromEntries(new FormData(form));
    let filtered = state.requests.filter((request) => {
      const query = (data.query || '').toLowerCase();
      return (data.status === 'all' || request.status === data.status)
        && (data.route === 'all' || placeKey(request, 'to') === data.route)
        && (!query || searchText(request).includes(query));
    });
    if (data.sort === 'ending') filtered = sortByEnding(filtered);
    $('#requestList').innerHTML = filtered.map(requestRow).join('') || `<div class="empty-state"><span>路</span><h2>${t('rq.nothingFound')}</h2><p>${t('rq.changeFilters')}</p></div>`;
    $('#requestResultCount').textContent = t('rq.shown', { count: filtered.length });
  }

  function filterLoads(form) {
    const data = Object.fromEntries(new FormData(form));
    let filtered = activeRequests().filter((request) => (data.from === 'all' || placeKey(request, 'from') === data.from) && (data.to === 'all' || placeKey(request, 'to') === data.to) && (data.logistics === 'all' || request.logistics === data.logistics));
    if (data.sort === 'ending') filtered = sortByEnding(filtered);
    if (data.sort === 'weight') filtered = filtered.slice().sort((a, b) => b.weight - a.weight);
    $('#loadGrid').innerHTML = filtered.map(loadTableRow).join('') || `<div class="empty-state"><span>货</span><h2>${t('loads.emptyTitle')}</h2><p>${t('loads.emptyText')}</p></div>`;
    showToast('filterApplied', { count: filtered.length });
  }

  function filterCompanies(form) {
    const data = Object.fromEntries(new FormData(form));
    const matches = (values, selected) => selected === 'all' || values.includes(selected);
    const filtered = companies.filter((company) => matches([company.city], data.city) && matches(company.logistics, data.logistics)
      && matches(company.transport, data.transport) && matches(company.services, data.services));
    $('#companyList').innerHTML = filtered.map(companyRow).join('') || `<div class="empty-state"><span>代</span><h2>${t('companies.noneTitle')}</h2><p>${t('rq.changeFilters')}</p></div>`;
    $('#companyResultCount').textContent = t('companies.count', { count: filtered.length });
  }

  function confirmDeal(dealId) {
    const role = parseRoute().role;
    const deal = state.deals.find((item) => item.id === dealId);
    if (!deal || !role) return;
    deal.confirmations = { client: false, forwarder: false, ...deal.confirmations, [role]: true };
    const status = dealStatus(deal);
    saveState();
    render();
    if (status.confirmed) showToast('dealConfirmed');
    else showToast('dealConfirmSent');
  }

  function markNotificationsRead() {
    const role = parseRoute().role;
    if (!role) return;
    state.notificationsRead = { ...state.notificationsRead, [role]: true };
    saveState();
    render();
    showToast('notificationsRead');
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('#profileMenu, #profileButton')) {
      $('#profileMenu').hidden = true;
      $('#profileButton').setAttribute('aria-expanded', 'false');
    }
    const authRedirect = event.target.closest('[data-auth-redirect]');
    if (authRedirect) {
      location.href = `../index.html?auth=register&role=${authRedirect.dataset.authRedirect}`;
      return;
    }
    const routeButton = event.target.closest('[data-route]');
    if (routeButton) { event.preventDefault(); closeOverlays(); go(routeButton.dataset.route); return; }
    const requestButton = event.target.closest('[data-open-request]');
    if (requestButton) { go(`client/request/${requestButton.dataset.openRequest}`); return; }
    const loadButton = event.target.closest('[data-open-load]');
    if (loadButton && !event.target.closest('[data-open-bid]')) { go(`forwarder/load/${loadButton.dataset.openLoad}`); return; }
    const bidButton = event.target.closest('[data-open-bid]');
    if (bidButton) { event.stopPropagation(); openBidModal(bidButton.dataset.openBid); return; }
    if (event.target.closest('[data-open-wizard]')) { openRequestWizard(); return; }
    const chooseButton = event.target.closest('[data-choose-offer]');
    if (chooseButton) { const [requestId, offerId] = chooseButton.dataset.chooseOffer.split(':'); openConfirm(requestId,offerId); return; }
    if (event.target.closest('[data-close-modal]')) { closeOverlays(); return; }
    if (event.target.closest('[data-save-draft]')) { saveDraft(); return; }
    const profileAction = event.target.closest('[data-profile-action]')?.dataset.profileAction;
    if (profileAction === 'profile') { closeOverlays(); showToast('profile'); }
    if (profileAction === 'settings') { closeOverlays(); showToast('settings', { languages: window.HaoruI18n.languages.map((lang) => ({ ru: 'RU', zh: '中文', en: 'EN' })[lang]).join(' / ') }); }
    if (profileAction === 'logout') {
      closeOverlays();
      resetDemoState();
      Promise.resolve(window.HaoruAuth?.signOut()).finally(() => { location.href = '../index.html?auth=login'; });
    }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'help') showToast('help');
    if (action === 'company-profile') showToast('companyProfile');
    if (action === 'read-all') markNotificationsRead();
    if (action === 'confirm-deal') confirmDeal(event.target.closest('[data-action]').dataset.dealId);
    if (action === 'deal-details') showToast('dealDetails');
    if (action === 'edit-profile') showToast('editProfile');
  });

  document.addEventListener('submit', (event) => {
    if (event.target.id === 'requestWizardForm') publishRequest(event);
    if (event.target.id === 'bidForm') submitBid(event);
    if (event.target.id === 'requestFilters') { event.preventDefault(); filterRequests(event.target); }
    if (event.target.id === 'loadFilters') { event.preventDefault(); filterLoads(event.target); }
    if (event.target.id === 'companyFilters') { event.preventDefault(); filterCompanies(event.target); }
  });

  $('#wizardNext').addEventListener('click', () => { if (validateWizardStep()) { wizardStep = Math.min(3,wizardStep + 1); updateWizard(); } });
  $('#wizardBack').addEventListener('click', () => { wizardStep = Math.max(1,wizardStep - 1); updateWizard(); });
  $('#confirmChooseButton').addEventListener('click', confirmChoose);
  $('#scrim').addEventListener('click', closeOverlays);
  $('#mobileMenuButton').addEventListener('click', () => { $('#appSidebar').classList.add('open'); $('#scrim').hidden = false; });
  $('#profileButton').addEventListener('click', (event) => {
    event.stopPropagation();
    const menu = $('#profileMenu');
    menu.hidden = !menu.hidden;
    $('#profileButton').setAttribute('aria-expanded', String(!menu.hidden));
  });
  $('#cargoPhotoInput').addEventListener('change', (event) => selectCargoPhoto(event.target.files?.[0]));
  // Views are rendered from the dictionaries, so a language switch is a re-render.
  window.HaoruI18n.onChange(() => {
    render();
    if (wizardStep === 3 && !$('#requestWizard').hidden) updateReview();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeOverlays(); });
  window.addEventListener('hashchange', () => {
    render();
    window.scrollTo(0, 0);
  });

  async function bootstrap() {
    if (window.HaoruAuth?.isConfigured) {
      authSession = await window.HaoruAuth.getSession();
      if (!authSession) {
        location.href = '../index.html?auth=login';
        return;
      }
      let offline = false;
      try {
        authUser = await window.HaoruAuth.getUser();
      } catch (error) {
        if (!error.network) throw error;
        offline = true;
      }
      authSession.user = authUser || authSession.user;
      try {
        authSession.profile = await window.HaoruAuth.getProfile();
      } catch (error) {
        if (!error.network) throw error;
        offline = true;
        authSession.profile = null;
      }
      if (offline) showToast('offline');
      const role = window.HaoruAuth.roleFromSession(authSession);
      if (!role) {
        resetDemoState();
        await window.HaoruAuth.signOut();
        location.href = '../index.html?auth=login';
        return;
      }
      bindDemoStateToOwner(`user:${authSession.user?.id || 'unknown'}`);
      const route = parseRoute();
      if (route.gate || route.role !== role) {
        go(window.HaoruAuth.routeForRole(role));
        return;
      }
    } else {
      // Without Supabase both roles share one demo marketplace on purpose: request → offer → choice.
      bindDemoStateToOwner('demo');
    }
    render();
  }

  bootstrap().catch((error) => {
    console.error(error);
    showToast('openFailed', { error: error.message });
  });
})();
