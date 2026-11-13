(() => {
  const STORAGE_KEY = 'haoru.prototype.v1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = (value, currency = 'RUB') => new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency, maximumFractionDigits: 0
  }).format(Number(value || 0));
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

  const initialRequests = [
    {
      id: 'HR-1048', status: 'active', from: 'Гуанчжоу', fromZh: '广州', to: 'Москва', toZh: '莫斯科',
      category: 'Товары для маркетплейсов', weight: 420, volume: 2.4, places: 12,
      ready: '12 ноября', logistics: 'Карго', transport: 'Авто + ж/д', auctionDuration: 48,
      timeLeft: 26340, budget: 200000, currency: 'RUB', services: ['Страхование', 'Таможенное оформление', 'До двери'],
      details: 'Нужна усиленная упаковка и доставка до склада в Москве.',
      offers: [
        { id: 'OF-501', company: 'Dragon Bridge', mark: '龙', verified: true, rating: '4,9', price: 186000, currency: 'RUB', days: 17, transport: 'Авто + ж/д', customs: 'Включено', services: ['Страхование', 'До двери'], comment: 'Заберём груз со склада поставщика, включим усиленную упаковку и доставку до двери.', updated: '12 минут назад' },
        { id: 'OF-502', company: 'Yunhe Logistics', mark: '云', verified: true, rating: '4,8', price: 198000, currency: 'RUB', days: 14, transport: 'Ж/д', customs: 'Включено', services: ['До двери'], comment: 'Отправка ближайшим поездом. Цена включает таможенное оформление и доставку до склада.', updated: '34 минуты назад' },
        { id: 'OF-503', company: 'SinoLine', mark: '海', verified: true, rating: '4,7', price: 214000, currency: 'RUB', days: 20, transport: 'Море + авто', customs: 'Оплачивается отдельно', services: ['Страхование', 'До двери'], comment: 'Подойдёт для несрочного груза. Таможенные платежи рассчитываются после получения инвойса.', updated: '1 час назад' }
      ]
    },
    {
      id: 'HR-1051', status: 'active', from: 'Шэньчжэнь', fromZh: '深圳', to: 'Казань', toZh: '喀山',
      category: 'Оборудование', weight: 1850, volume: 6, places: 8, ready: '16 ноября',
      logistics: 'Официальная', transport: 'Ж/д', auctionDuration: 48, timeLeft: 116820,
      budget: 5000, currency: 'USD', services: ['Таможенное оформление', 'До двери'], details: 'Деревянные ящики, не кантовать.',
      offers: [
        { id: 'OF-511', company: 'EastRail Cargo', mark: '铁', verified: true, rating: '4,8', price: 4720, currency: 'USD', days: 21, transport: 'Ж/д', customs: 'Включено', services: ['До двери'], comment: 'Погрузка с контролем крепления деревянных ящиков. Не кантовать — учтено.', updated: '18 минут назад' },
        { id: 'OF-512', company: 'Dragon Bridge', mark: '龙', verified: true, rating: '4,9', price: 4890, currency: 'USD', days: 18, transport: 'Авто + ж/д', customs: 'Включено', services: ['Страхование'], comment: 'Ускоренный маршрут через Казахстан, страхование включено.', updated: '48 минут назад' }
      ]
    },
    {
      id: 'HR-1039', status: 'waiting', from: 'Иу', fromZh: '义乌', to: 'Санкт-Петербург', toZh: '圣彼得堡',
      category: 'Одежда и текстиль', weight: 760, volume: 4.1, places: 24, ready: '8 ноября',
      logistics: 'Карго', transport: 'Не важно', auctionDuration: 48, timeLeft: 0,
      budget: 240000, currency: 'RUB', services: ['Консолидация', 'До двери'], details: '',
      offers: [
        { id: 'OF-491', company: 'Red Gate Logistics', mark: '门', verified: true, rating: '4,7', price: 228000, currency: 'RUB', days: 19, transport: 'Авто', customs: 'Включено', services: ['Консолидация', 'До двери'], updated: 'вчера' },
        { id: 'OF-492', company: 'SinoLine', mark: '海', verified: true, rating: '4,7', price: 235000, currency: 'RUB', days: 17, transport: 'Ж/д', customs: 'Включено', services: ['До двери'], updated: 'вчера' }
      ]
    },
    {
      id: 'HR-1027', status: 'chosen', chosenOfferId: 'OF-471', from: 'Нинбо', fromZh: '宁波', to: 'Екатеринбург', toZh: '叶卡捷琳堡',
      category: 'Мебель и интерьер', weight: 2400, volume: 14, places: 30, ready: '2 ноября',
      logistics: 'Официальная', transport: 'Море + ж/д', auctionDuration: 72, timeLeft: 0,
      budget: 6300, currency: 'USD', services: ['Страхование', 'Таможенное оформление', 'До двери'], details: '',
      offers: [
        { id: 'OF-471', company: 'Yunhe Logistics', mark: '云', verified: true, rating: '4,8', price: 6140, currency: 'USD', days: 28, transport: 'Море + ж/д', customs: 'Включено', services: ['Страхование', 'До двери'], updated: '4 дня назад' }
      ]
    },
    {
      id: 'DRAFT-1', status: 'draft', from: 'Фошань', fromZh: '佛山', to: 'Новосибирск', toZh: '新西伯利亚',
      category: 'Мебель и интерьер', weight: 0, volume: 0, places: 0, ready: 'Не указано', logistics: 'Карго',
      transport: 'Не важно', auctionDuration: 48, timeLeft: 0, budget: 0, currency: 'RUB', services: [], details: '', offers: []
    }
  ];

  const defaultState = {
    role: null,
    language: 'ru',
    requestCounter: 1052,
    requests: initialRequests,
    deals: [
      { id: 'DL-203', requestId: 'HR-1027', status: 'Ожидает подтверждения', delivery: 'В работе', contactsOpen: true }
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

  const zhDictionary = {
    'Закрытая тестовая версия': '封闭测试版',
    'Рабочее пространство': '工作空间',
    'Грузовладелец': '货主',
    'Кабинет клиента': '客户工作台',
    'Экспедитор': '货运代理',
    'Защищённое пространство': '安全工作空间',
    'Роль аккаунта фиксируется при регистрации.': '账户角色在注册时确定，之后不可更改。',
    'Вернуться на основной сайт': '返回官方网站',
    'Личный кабинет': '个人中心',
    'Добро пожаловать! Здесь собраны заявки, предложения и ближайшие действия.': '欢迎！这里汇总了您的货运需求、报价和待办事项。',
    'Управляйте черновиками, активными торгами и выбором исполнителя.': '管理草稿、进行中的竞价并选择承运方。',
    'Проверенные компании по направлению Китай → Россия.': '查看中国至俄罗斯线路的已认证公司。',
    'Выбранные перевозки, подтверждения и статусы доставки.': '查看已选择的运输、确认及配送状态。',
    'Все значимые события платформы в одном месте.': '所有重要平台通知集中展示。',
    'Подходящие грузы, ваши предложения и статус компании.': '适合您的货源、报价和公司状态。',
    'Публичные заявки российских грузовладельцев в реальном времени.': '实时查看俄罗斯货主发布的公开货源。',
    'Активные, выбранные и завершённые коммерческие предложения.': '管理进行中、已中选和已完成的报价。',
    'Профиль и документы экспедиторской компании.': '货运代理公司的资料与文件。',
    'Выбранные перевозки и действия по подтверждению.': '查看已中选运输及确认操作。',
    'Приглашения, изменения ставок и результаты торгов.': '邀请、报价变更和竞价结果。',
    'Главная': '首页', 'Мои заявки': '我的货运需求', 'Экспедиторы': '货运代理',
    'Сделки': '交易', 'Уведомления': '通知', 'Биржа грузов': '货源大厅',
    'Мои предложения': '我的报价', 'Проверка компании': '公司认证',
    'Основное': '主要功能', 'Работа': '工作', 'Компания': '公司',
    'Все заявки': '全部需求', 'Создать заявку': '发布货运需求', 'Новая заявка': '新货运需求',
    'Профиль компании': '公司资料', 'Найти грузы': '查找货源',
    'Активные торги': '进行中的竞价', 'Новых предложений': '新报价',
    'Ожидают выбора': '等待选择', 'Черновики': '草稿', 'Активные заявки': '进行中的需求',
    'Последние события': '最新动态', 'Быстрые действия': '快捷操作',
    'Ближайшее завершение': '即将结束', 'Смотреть все': '查看全部',
    'Создать новую заявку': '发布新需求', 'Сравнить предложения': '比较报价',
    'Найти экспедитора': '查找货运代理', 'Открыть торги': '打开竞价',
    'Поиск': '搜索', 'Статус': '状态', 'Маршрут': '路线', 'Сортировка': '排序',
    'Все статусы': '全部状态', 'Все направления': '全部线路', 'Сначала новые': '最新优先',
    'Ближайшее завершение': '即将结束', 'Применить': '应用', 'Показано': '已显示',
    'Идут торги': '竞价中', 'Ожидает выбора': '等待选择', 'Черновик': '草稿',
    'Исполнитель выбран': '已选择承运方', 'Отменена': '已取消', 'Торги завершены': '竞价已结束',
    'Статус': '状态', 'Лучшая цена': '最低价', 'Предложения': '报价',
    'До закрытия': '距结束', 'Пока нет': '暂无', 'Не опубликована': '未发布',
    'Компания': '公司', 'Стоимость': '价格', 'Срок': '时效', 'Транспорт': '运输方式',
    'Условия': '条件', 'проверена': '已认证', 'лучшая цена': '最低价',
    'дней': '天', 'ориентировочно': '预计', 'Комментарий не добавлен': '未添加备注',
    'Выбрать': '选择', 'Выбран': '已选择', 'Изменить': '修改', 'Анонимно': '匿名',
    'Предложения экспедиторов': '货运代理报价', 'Таблица': '表格', 'Карточки': '卡片',
    'Параметры груза': '货物参数', 'Готовность': '备货日期', 'Мест': '件数',
    'Тип логистики': '物流类型', 'Услуги': '服务', 'Комментарий': '备注', 'Нет': '无',
    'Выбранный исполнитель': '已选择的承运方', 'Контакты защищены': '联系方式受保护',
    'Открыть сделку': '打开交易', 'Проверена': '已认证', 'Рейтинг': '评分', 'Сделок': '交易数',
    'Ответ': '响应', 'Маршруты': '线路', 'Центр уведомлений': '通知中心',
    'Прочитать все': '全部已读', 'Подходящие грузы': '匹配货源', 'Активные предложения': '有效报价',
    'Приглашения': '邀请', 'Требуют ответа': '需要回复', 'Компания верифицирована': '公司已认证',
    'Все грузы': '全部货源', 'Новая ставка': '新报价', 'Коммерческое предложение': '商业报价',
    'Стоимость *': '价格 *', 'Валюта *': '币种 *', 'Срок, дней *': '时效（天）*',
    'Вид транспорта *': '运输方式 *', 'Таможенное оформление *': '清关服务 *',
    'Что входит в предложение': '报价包含内容', 'Комментарий клиенту': '给客户的备注',
    'Отмена': '取消', 'Отправить предложение': '提交报价', 'Подтверждение выбора': '确认选择',
    'Выбрать экспедитора?': '选择该货运代理？', 'Вернуться': '返回', 'Подтвердить выбор': '确认选择',
    'Создание перевозки': '创建运输需求', 'Маршрут и груз': '路线与货物',
    'Условия': '条件', 'Проверка': '确认', 'Откуда в Китае *': '中国起运地 *',
    'Куда в России *': '俄罗斯目的地 *', 'Категория груза *': '货物类别 *',
    'Количество мест': '件数', 'Вес, кг *': '重量（公斤）*', 'Объём, м³ *': '体积（立方米）*',
    'Груз будет готов *': '备货日期 *', 'Добавить фото груза': '添加货物照片',
    'Предпочтительный транспорт': '首选运输方式', 'Желаемый срок доставки': '期望运输时效',
    'Целевой бюджет': '目标预算', 'Срок торгов': '竞价时长', 'Дополнительные услуги': '附加服务',
    'Комментарий и специальные требования': '备注和特殊要求', 'Всё готово к публикации': '已准备发布',
    'Сохранить черновик': '保存草稿', 'Продолжить': '继续', 'Опубликовать заявку': '发布需求',
    'Назад': '上一步', 'Мой профиль': '我的资料', 'Личные данные и компания': '个人与公司信息',
    'Настройки': '设置', 'Язык и уведомления': '语言与通知', 'Выйти': '退出登录',
    'Завершить текущую сессию': '结束当前会话', 'Помощь': '帮助', 'Готово': '完成'
  };
  Object.assign(zhDictionary, {
    'Заявка': '货运需求', 'Груз': '货物', 'Логистика': '物流', 'Бюджет': '预算',
    'Предложений': '报价数量', 'Цены в разных валютах не конвертируются автоматически': '不同币种的报价不会自动换算',
    'Контакты сторон откроются только после окончательного выбора конкретного предложения。': '仅在最终选择具体报价后，双方联系方式才会开放。',
    'Контакты сторон откроются только после окончательного выбора конкретного предложения.': '仅在最终选择具体报价后，双方联系方式才会开放。',
    'Гуанчжоу': '广州', 'Шэньчжэнь': '深圳', 'Москва': '莫斯科', 'Казань': '喀山',
    'Санкт-Петербург': '圣彼得堡', 'Екатеринбург': '叶卡捷琳堡', 'Новосибирск': '新西伯利亚',
    'Нинбо': '宁波', 'Фошань': '佛山', 'Иу': '义乌', 'Сиань': '西安',
    'Китай': '中国', 'Россия': '俄罗斯',
    'Товары для маркетплейсов': '电商平台商品', 'Электроника': '电子产品',
    'Одежда и текстиль': '服装与纺织品', 'Оборудование': '设备', 'Мебель и интерьер': '家具与家居',
    'Карго': '货代物流', 'Официальная': '正规报关物流', 'Не важно': '不限',
    'Авто + ж/д': '公路 + 铁路', 'Море + авто': '海运 + 公路', 'Море + ж/д': '海运 + 铁路',
    'Авто': '公路', 'Ж/д': '铁路', 'Море': '海运', 'Авиа': '空运', 'Мультимодальный': '多式联运',
    'Страхование': '保险', 'До двери': '送货上门', 'Консолидация': '拼货',
    'Таможенное оформление': '清关', 'Таможня': '海关', 'Обрешётка': '木架包装',
    'Включено': '已包含', 'Оплачивается отдельно': '另行支付', 'Не требуется': '无需',
    'Не указаны': '未指定', 'Не указано': '未指定', 'Не указан': '未指定',
    '12 ноября': '11月12日', '16 ноября': '11月16日', '8 ноября': '11月8日', '2 ноября': '11月2日',
    '12 минут назад': '12分钟前', '34 минуты назад': '34分钟前', '48 минут назад': '48分钟前',
    '18 минут назад': '18分钟前', '1 час назад': '1小时前', '4 дня назад': '4天前',
    'вчера': '昨天', 'только что': '刚刚', 'сегодня': '今天',
    'Нужна усиленная упаковка и доставка до склада в Москве.': '需要加固包装并送至莫斯科仓库。',
    'Заберём груз со склада поставщика, включим усиленную упаковку и доставку до двери.': '可从供应商仓库提货，包含加固包装和送货上门。',
    'Отправка ближайшим поездом. Цена включает таможенное оформление и доставку до склада.': '安排最近班列，价格包含清关及送至仓库。',
    'Подойдёт для несрочного груза. Таможенные платежи рассчитываются после получения инвойса.': '适合非紧急货物，收到发票后计算关税。',
    'Погрузка с контролем крепления деревянных ящиков. Не кантовать — учтено.': '装载时检查木箱固定，已注明禁止翻转。',
    'Ускоренный маршрут через Казахстан, страхование включено.': '经哈萨克斯坦的加急线路，已含保险。',
    'Предложений пока нет': '暂无报价',
    'Проверенные экспедиторы увидят заявку в ленте и смогут отправить условия.': '已认证货运代理将在货源大厅看到需求并可提交报价。',
    'Все торги идут по плану': '所有竞价均正常进行', '+2 за последний час': '过去一小时新增2个',
    'Нужно ваше решение': '等待您的决定', 'Можно продолжить позже': '可稍后继续',
    'Торги и последние предложения': '竞价与最新报价', 'Сегодня': '今天',
    'Продолжите с нужного шага': '从所需步骤继续', 'Маршрут, груз и условия': '路线、货物与条件',
    '2 варианта ожидают выбора': '有2个方案等待选择', 'Только проверенные компании': '仅限已认证公司',
    'Dragon Bridge снизила цену': 'Dragon Bridge 已降价', 'Новая цена по заявке': '货运需求的新价格',
    'Новое предложение': '新报价', 'Торги завершены': '竞价已结束',
    'ожидает вашего выбора': '等待您的选择', 'новая цена': '新价格',
    'Маршрут или номер': '路线或编号', 'Активные торги': '进行中的竞价',
    'Ожидают выбора': '等待选择', 'Исполнитель выбран': '已选择承运方',
    'В Москву': '到莫斯科', 'В Казань': '到喀山', 'Новая заявка': '新货运需求',
    'Город отправления': '起运城市', 'Весь Китай': '中国全境', 'Вид логистики': '物流类型',
    'Любой': '不限', 'Все виды': '全部方式', 'Любые': '不限', 'Найти': '查找',
    'до 2 часов': '2小时内', 'Китай → Россия': '中国 → 俄罗斯', 'Профиль': '资料',
    'Связана с заявкой': '关联货运需求', 'Исполнитель': '承运方', 'Итоговая стоимость': '最终价格',
    'Доставка': '运输', 'Подтвердить сделку': '确认交易', 'Карточка сделки': '交易详情',
    'Ожидает подтверждения': '等待确认', 'В работе': '进行中', 'Подготовка к перевозке': '准备运输',
    'Непрочитанные события отмечены красным': '未读通知以红色标记',
    'Компания прошла проверку': '公司已通过认证', 'доступна в каталоге': '已收录到公司目录',
    'Новое приглашение': '新邀请', 'Ваша ставка сейчас лучшая': '您的报价目前最低',
    'До закрытия торгов': '距竞价结束', 'Подходящие грузы': '匹配货源',
    'Одно лидирует по цене': '其中一个报价最低', 'Требуют ответа': '需要回复',
    'По маршрутам и профилю': '根据线路与公司资料匹配', 'Все грузы': '全部货源',
    'Сегодня в HAORU': '今日 HAORU', 'Тестовые данные': '测试数据', 'новых груза': '个新货源',
    'Из Гуанчжоу, Иу и Шэньчжэня': '来自广州、义乌和深圳',
    'Официальная доставка в Казань': '正规报关运输至喀山',
    'Конкурент изменил ставку': '竞争方调整了报价', 'имя скрыто': '名称已隐藏',
    'Найти подходящий груз': '查找匹配货源', 'Проверить мои ставки': '查看我的报价',
    'Статус компании': '公司状态', 'Доступ к торгам': '竞价权限', 'Полный': '完整权限',
    'Активных вариантов': '有效报价次数', 'Следующее действие': '下一步', 'Ответить на приглашения': '回复邀请',
    'Откуда': '起运地', 'Куда': '目的地', 'Все города': '全部城市',
    'Вес': '重量', 'Объём': '体积', 'Готов': '备货', 'Бюджет клиента': '客户预算',
    'Открыть заявку': '打开需求', 'Сделать ставку': '提交报价',
    'Названия конкурентов скрыты до завершения торгов': '竞价结束前隐藏竞争方名称',
    'Правила торгов': '竞价规则', 'Ваших вариантов': '您的报价次数', 'Изменение ставки': '修改报价',
    'после таймера': '计时结束后', 'Контакты клиента': '客户联系方式', 'скрыты': '已隐藏',
    'Отправить предложение': '提交报价', 'Вы ещё не отправляли предложений': '您尚未提交报价',
    'Откройте биржу грузов, выберите подходящую заявку и укажите цену, срок и условия.': '打开货源大厅，选择合适需求并填写价格、时效和条件。',
    'Перейти к грузам': '前往货源大厅', 'Ваша цена': '您的价格', 'Активна': '进行中',
    'Изменение': '修改', 'доступно сейчас': '现在可修改',
    'Данные компании': '公司信息', 'Юридическое название, город и регистрационный код': '法定名称、城市及注册代码',
    'Заполнено': '已填写', 'Регистрационные документы': '注册文件', 'Проверено': '已审核',
    'Контактное лицо': '联系人', 'Телефон, email и WeChat': '电话、邮箱和微信', 'Подтверждено': '已确认',
    'Профиль услуг': '服务资料', 'Маршруты, транспорт, категории и ограничения': '线路、运输方式、品类与限制',
    'Опубликовано': '已发布', 'Возможности аккаунта': '账户权限', 'Просмотр заявок': '查看需求',
    'Доступен': '可用', 'Отправка ставок': '提交报价', 'Доступна': '可用', 'Сотрудников': '员工数',
    'Тариф': '套餐', 'Редактировать профиль': '编辑资料',
    'Неограниченный срок': '不限时效', 'Любой разумный срок': '合理时效均可',
    'До 10 дней': '10天内', 'До 20 дней': '20天内', 'До 30 дней': '30天内',
    '24 часа': '24小时', '48 часов': '48小时', '72 часа': '72小时', '7 дней': '7天',
    'Быстрее и проще': '更快捷简便', 'С таможенным оформлением': '含正规清关',
    'Например: нужна обрешётка, груз содержит аккумуляторы': '例如：需要木架包装，货物含电池',
    'После публикации экспедиторы смогут отправлять предложения в течение выбранного срока.': '发布后，货运代理可在设定期限内提交报价。',
    'Я подтверждаю корректность параметров груза. Существенные условия нельзя будет изменить после первой ставки.': '我确认货物参数正确。收到首个报价后将无法修改关键条件。',
    'Опишите ограничения и важные условия': '请说明限制和重要条件',
    'Конкуренты увидят цену и условия анонимно. Название вашей компании увидит только грузовладелец.': '竞争方将匿名查看价格和条件，只有货主能看到您的公司名称。',
    'Торги завершатся, а контакты сторон станут доступны друг другу. Это действие фиксируется в истории заявки.': '竞价将结束，双方联系方式将互相开放，此操作会记录在需求历史中。'
    ,'+4 за сегодня': '今日新增4个', 'Категория': '货物类别', 'Груз готов': '备货日期',
    'Текущая лучшая цена': '当前最低价', 'Приглашение': '邀请', 'Аукцион': '竞价',
    '12 мин': '12分钟', '18 мин': '18分钟', '8 мин': '8分钟', '5 часов назад': '5小时前',
    '1 из 3': '3次中已用1次', '2 из 3': '3次中已用2次', '3 из 3': '3次已用完',
    'Работа · Работа': '工作', '工作 · Работа': '工作', 'Компания · Компания': '公司', '公司 · Компания': '公司',
    '适合您的货源 · Подходящие грузы': '适合您的货源', '已认证 · Проверена': '已认证',
    'Действие выполнено': '操作已完成', 'кг': '公斤', 'м³': '立方米',
    'Обзор перевозок': '运输概览', 'Рабочий обзор': '工作概览', 'Обзор': '概览',
    'Рабочая платформа': '工作平台', 'Контур работы': '工作角色', 'Данные защищены': '数据受保护',
    'Контакты открываются только после выбора исполнителя.': '仅在选定承运方后开放联系方式。',
    'Рабочее пространство': '工作空间', 'Заявки, предложения и ближайшие действия по маршруту Китай → Россия': '中国至俄罗斯线路的需求、报价与下一步操作',
    'Подходящие грузы, предложения и ближайшие действия компании': '匹配货源、报价与公司下一步操作',
    'Предложения в торгах': '竞价报价', 'в текущих торгах': '当前竞价中', 'Требуют решения': '等待决定',
    'заявки открыты': '个需求开放中', 'черновик': '个草稿', 'черновика': '个草稿',
    'Сравнить 2 предложения': '比较2个报价', 'Проверить ход торгов': '查看竞价进展', 'Открыть': '打开',
    'Каталог экспедиторов': '货运代理目录', 'Проверенные компании': '已认证公司',
    'Маршрут и груз': '路线与货物', 'Стоимость': '价格', 'Торги': '竞价',
    'Новое приглашение': '新邀请', 'Предложить условия': '提交运输条件', 'Ответить': '回复',
    'открыты для ставок': '可提交报价', 'текущие ставки': '当前报价', 'требуют ответа': '需要回复',
    'События биржи': '货源动态', 'Изменилась лучшая ставка': '最低报价已更新',
    'Проверенные экспедиторы': '已认证货运代理', 'Компании, допущенные к торгам': '已获竞价资格的公司',
    'Специализация': '服务范围', 'Рейтинг': '评分', 'Сделок': '交易数', 'Проверена': '已认证',
    'Готовность': '备货日期', 'Нет ставок': '暂无报价', 'предлож.': '个报价', 'Ставка': '报价'
  });
  const originalAttributes = new WeakMap();

  function translateText(value) {
    let result = String(value || '');
    Object.entries(zhDictionary).sort((a, b) => b[0].length - a[0].length).forEach(([ru, zh]) => {
      result = result.split(ru).join(zh);
    });
    return result;
  }

  function applyPlatformLanguage(root = document) {
    document.documentElement.lang = state.language === 'zh' ? 'zh-CN' : 'ru';
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName)) continue;
      if (node.__haoruRu === undefined) node.__haoruRu = node.nodeValue;
      node.nodeValue = state.language === 'zh' ? translateText(node.__haoruRu) : node.__haoruRu;
    }
    $$('[placeholder],[aria-label],option', root).forEach((element) => {
      const saved = originalAttributes.get(element) || {};
      ['placeholder', 'aria-label'].forEach((attribute) => {
        if (element.hasAttribute(attribute) && saved[attribute] === undefined) saved[attribute] = element.getAttribute(attribute);
        if (saved[attribute] !== undefined) element.setAttribute(attribute, state.language === 'zh' ? translateText(saved[attribute]) : saved[attribute]);
      });
      originalAttributes.set(element, saved);
    });
    $('#languageButton').innerHTML = state.language === 'ru' ? 'RU <span>/ 中文</span>' : '中文 <span>/ RU</span>';
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && Array.isArray(saved.requests)) {
        const initialOfferComments = new Map(initialRequests.flatMap((request) => request.offers.map((offer) => [offer.id, offer.comment || ''])));
        saved.requests.forEach((request) => request.offers?.forEach((offer) => {
          if (!offer.comment && initialOfferComments.has(offer.id)) offer.comment = initialOfferComments.get(offer.id);
        }));
        return { ...clone(defaultState), ...saved };
      }
    } catch (error) {
      console.warn('HAORU demo state could not be loaded', error);
    }
    return clone(defaultState);
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) {
      console.warn('HAORU demo state could not be saved', error);
    }
  }

  const routeTitles = {
    client: {
      dashboard: ['Обзор перевозок', 'Заявки, предложения и ближайшие действия по маршруту Китай → Россия'],
      requests: ['Мои заявки', 'Управляйте черновиками, активными торгами и выбором исполнителя.'],
      companies: ['Экспедиторы', 'Проверенные компании по направлению Китай → Россия.'],
      deals: ['Сделки', 'Выбранные перевозки, подтверждения и статусы доставки.'],
      notifications: ['Уведомления', 'Все значимые события платформы в одном месте.']
    },
    forwarder: {
      dashboard: ['Рабочий обзор', 'Подходящие грузы, предложения и ближайшие действия компании'],
      loads: ['货源 · Биржа грузов', 'Публичные заявки российских грузовладельцев в реальном времени.'],
      offers: ['我的报价 · Мои предложения', 'Активные, выбранные и завершённые коммерческие предложения.'],
      verification: ['公司认证 · Проверка компании', 'Профиль и документы экспедиторской компании.'],
      deals: ['交易 · Сделки', 'Выбранные перевозки и действия по подтверждению.'],
      notifications: ['通知 · Уведомления', 'Приглашения, изменения ставок и результаты торгов.']
    }
  };

  const navigation = {
    client: [
      ['Основное'],
      ['dashboard', 'home', 'Обзор'], ['requests', 'clipboard', 'Мои заявки', '3'], ['companies', 'building', 'Экспедиторы'],
      ['Работа'],
      ['deals', 'handshake', 'Сделки', '1'], ['notifications', 'bell', 'Уведомления', '4']
    ],
    forwarder: [
      ['Работа'],
      ['dashboard', 'home', 'Обзор'], ['loads', 'clipboard', 'Биржа грузов', '12'], ['offers', 'bid', 'Мои предложения', '2'],
      ['Компания'],
      ['verification', 'checkUser', 'Проверка компании'], ['deals', 'handshake', 'Сделки'], ['notifications', 'bell', 'Уведомления', '3']
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

  function showToast(title, message) {
    const toast = $('#toast');
    $('b', toast).textContent = title;
    $('small', toast).textContent = message;
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

  function currentRoleLabel(role) {
    return role === 'forwarder'
      ? { mark: '运', title: 'Экспедитор', subtitle: '货运代理工作台' }
      : { mark: '货', title: 'Грузовладелец', subtitle: 'Кабинет клиента' };
  }

  function renderChrome(role, view) {
    const label = currentRoleLabel(role);
    $('#roleIdentity').innerHTML = `<i>${label.mark}</i><span>${label.title}<small>${label.subtitle}</small></span><b>✓</b>`;
    $('#profileRole').textContent = role === 'client' ? 'Грузовладелец' : 'Экспедитор · 已认证';
    const metadata = authUser?.user_metadata || authSession?.user?.user_metadata || {};
    const profile = authSession?.profile || {};
    const profileName = role === 'forwarder'
      ? (profile.company || metadata.company || profile.full_name || metadata.full_name || 'Dragon Bridge')
      : (profile.full_name || metadata.full_name || 'Иван Новиков');
    const initials = profileName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || (role === 'client' ? 'ГВ' : 'ЭК');
    const profileNameNode = $('#profileName').childNodes[0];
    profileNameNode.nodeValue = profileName;
    profileNameNode.__haoruRu = profileName;
    $('#profileInitials').textContent = initials;

    $('#sidebarNav').innerHTML = navigation[role].map((item) => {
      if (item.length === 1) return `<span class="nav-label">${item[0]}</span>`;
      const [key, icon, title, count] = item;
      const active = view === key || (role === 'client' && view === 'request' && key === 'requests') || (role === 'forwarder' && view === 'load' && key === 'loads');
      return `<button class="${active ? 'active' : ''}" data-route="${role}/${key}"><i>${svgIcon(icon)}</i><span>${title}</span>${count ? `<b>${count}</b>` : ''}</button>`;
    }).join('');

    const dockItems = navigation[role].filter((item) => item.length > 1).slice(0, 4);
    $('#mobileDock').innerHTML = dockItems.map(([key, icon, title]) => {
      const active = view === key || (view === 'request' && key === 'requests') || (view === 'load' && key === 'loads');
      return `<button class="${active ? 'active' : ''}" data-route="${role}/${key}"><i>${svgIcon(icon)}</i><span>${title}</span></button>`;
    }).join('');
  }

  function heading(role, view, id) {
    if (view === 'request') {
      const request = findRequest(id);
      return [`Заявка ${request?.id || ''}`, `${request?.from || ''} → ${request?.to || ''}`];
    }
    if (view === 'load') {
      const load = findRequest(id);
      return [`Заявка ${load?.id || ''}`, `${load?.from || ''} → ${load?.to || ''}`];
    }
    return routeTitles[role]?.[view] || routeTitles[role].dashboard;
  }

  function renderHeading(role, view, id) {
    const [title, subtitle] = heading(role, view, id);
    const section = view === 'dashboard' ? 'Рабочее пространство' : title;
    const actions = role === 'client'
      ? `<button class="button ghost" data-route="client/requests">Все заявки</button><button class="button primary" data-open-wizard>${svgIcon('plus', 16)} Создать заявку</button>`
      : `<button class="button ghost" data-route="forwarder/verification">Профиль компании</button><button class="button dark" data-route="forwarder/loads">Найти грузы →</button>`;
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
      applyPlatformLanguage();
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
    applyPlatformLanguage();
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
  const statusLabel = (status) => ({ active: 'Идут торги', waiting: 'Ожидает выбора', draft: 'Черновик', chosen: 'Исполнитель выбран', cancelled: 'Отменена' })[status] || status;
  const statusClass = (status) => ({ active: 'active', waiting: 'waiting', draft: 'draft', chosen: 'chosen' })[status] || 'draft';

  function timerLabel(seconds) {
    if (!seconds) return 'Торги завершены';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  function routeSignature(request, options = {}) {
    const forwarder = Boolean(options.forwarder);
    const compact = Boolean(options.compact);
    const fromName = forwarder ? `${request.fromZh} · ${request.from}` : request.from;
    const toName = forwarder ? `${request.toZh} · ${request.to}` : request.to;
    return `<div class="route-signature${compact ? ' compact' : ''}"><span><b>${escapeHtml(fromName)}</b><small>Китай</small></span><i class="route-track"><u></u></i><span><b>${escapeHtml(toName)}</b><small>Россия</small></span></div>`;
  }

  function requestRow(request) {
    const best = bestOffer(request);
    return `<article class="request-row" data-open-request="${escapeHtml(request.id)}" tabindex="0">
      <div class="route-cell"><i class="route-icon">${svgIcon(request.status === 'draft' ? 'file' : 'route', 17)}</i><span><b>${escapeHtml(request.from)} → ${escapeHtml(request.to)}</b><small>${escapeHtml(request.category)} · ${escapeHtml(request.weight || '—')} кг · ${escapeHtml(request.volume || '—')} м³</small></span></div>
      <div class="request-meta"><small>Статус</small><span class="status ${statusClass(request.status)}">${escapeHtml(statusLabel(request.status))}</span></div>
      <div class="request-price"><small>${best ? 'Лучшая цена' : 'Предложения'}</small><b>${best ? money(best.price, best.currency) : request.status === 'draft' ? 'Не опубликована' : 'Пока нет'}</b></div>
      <div class="request-time"><small>${request.status === 'active' ? 'До закрытия' : 'Предложений'}</small><b>${request.status === 'active' ? timerLabel(request.timeLeft) : request.offers.length}</b></div>
      <button class="row-arrow" aria-label="Открыть">${svgIcon('arrow', 17)}</button>
    </article>`;
  }

  function clientDashboard() {
    const active = activeRequests();
    const waiting = state.requests.filter((request) => request.status === 'waiting').length;
    const drafts = state.requests.filter((request) => request.status === 'draft').length;
    const newOffers = active.reduce((sum, request) => sum + request.offers.length, 0);
    const decision = state.requests.find((request) => request.status === 'waiting') || active[0];
    return `<div class="overview-band">
      <section class="metric-strip" aria-label="Сводка"><article><small>Активные торги</small><b>${active.length}</b><em>заявки открыты</em></article><article><small>Предложения</small><b>${newOffers}</b><em>в текущих торгах</em></article><article><small>Требуют решения</small><b>${waiting}</b><em>${drafts} ${drafts === 1 ? 'черновик' : 'черновика'}</em></article></section>
      <article class="attention-card"><div class="attention-copy"><span>Следующее действие</span><h2>${decision?.status === 'waiting' ? `Сравнить ${decision.offers.length} предложения` : 'Проверить ход торгов'}</h2><p>${escapeHtml(decision?.id || 'HR-1048')} · ${escapeHtml(decision?.category || 'Заявка на перевозку')}</p></div>${decision ? routeSignature(decision, { compact: true }) : ''}<button class="button primary" data-open-request="${escapeHtml(decision?.id || 'HR-1048')}">Открыть ${svgIcon('arrow', 16)}</button></article>
    </div>
    <div class="workspace-grid">
      <section class="panel table-panel dashboard-table"><div class="panel-head"><div><h2>Активные заявки</h2><p>Торги и последние предложения</p></div><button data-route="client/requests">Все заявки ${svgIcon('arrow', 15)}</button></div><div class="request-list-head"><span>Маршрут и груз</span><span>Статус</span><span>Лучшая цена</span><span>До закрытия</span><span></span></div><div class="request-list">${active.slice(0, 4).map(requestRow).join('')}</div></section>
      <aside class="work-rail"><section class="panel activity-panel"><div class="panel-head"><div><h2>Последние события</h2><p>Сегодня</p></div></div><div class="activity-list"><div class="activity-item"><i>${svgIcon('trend', 17)}</i><span><b>Dragon Bridge снизила цену</b><small>HR-1048 · 186 000 ₽</small></span><time>12 мин</time></div><div class="activity-item"><i>${svgIcon('bid', 17)}</i><span><b>Новое предложение</b><small>EastRail ответила на HR-1051</small></span><time>18 мин</time></div><div class="activity-item"><i>${svgIcon('clock', 17)}</i><span><b>Торги завершены</b><small>HR-1039 ожидает выбора</small></span><time>1 ч</time></div></div></section>
      <section class="panel action-panel"><div class="panel-head"><div><h2>Быстрые действия</h2><p>Продолжите с нужного шага</p></div></div><div class="quick-actions"><button class="quick-action" data-open-wizard><i>${svgIcon('plus')}</i><span><b>Создать заявку</b><small>Маршрут, груз и условия</small></span><span>${svgIcon('arrow', 16)}</span></button><button class="quick-action" data-route="client/companies"><i>${svgIcon('building')}</i><span><b>Каталог экспедиторов</b><small>Проверенные компании</small></span><span>${svgIcon('arrow', 16)}</span></button></div></section></aside>
    </div>`;
  }

  function clientRequests() {
    return `<section class="panel table-panel data-panel"><div class="panel-head"><div><h2>Все заявки</h2><p id="requestResultCount">Показано ${state.requests.length}</p></div><button data-open-wizard>${svgIcon('plus', 15)} Новая заявка</button></div><form class="filters compact" id="requestFilters"><label class="search-field"><span>Поиск</span><input name="query" placeholder="Маршрут или номер"></label><label><span>Статус</span><select name="status"><option value="all">Все статусы</option><option value="active">Активные торги</option><option value="waiting">Ожидают выбора</option><option value="draft">Черновики</option><option value="chosen">Исполнитель выбран</option></select></label><label><span>Маршрут</span><select name="route"><option value="all">Все направления</option><option value="Москва">В Москву</option><option value="Казань">В Казань</option></select></label><label><span>Сортировка</span><select><option>Сначала новые</option><option>Ближайшее завершение</option></select></label><button class="button dark" type="submit">Применить</button></form><div class="request-list-head"><span>Маршрут и груз</span><span>Статус</span><span>Стоимость</span><span>Торги</span><span></span></div><div class="request-list" id="requestList">${state.requests.map(requestRow).join('')}</div></section>`;
  }

  function detailHero(request, forForwarder = false) {
    const best = bestOffer(request);
    return `<section class="detail-hero"><div class="detail-top"><span class="status ${statusClass(request.status)}">${escapeHtml(statusLabel(request.status))}</span><small>${escapeHtml(request.id)}</small></div>${routeSignature(request, { forwarder: forForwarder })}<div class="detail-chips"><span>${escapeHtml(request.weight)} кг</span><span>${escapeHtml(request.volume)} м³</span><span>${escapeHtml(request.category)}</span><span>${escapeHtml(request.logistics)}</span><span>${escapeHtml(request.transport)}</span></div><div class="detail-stats"><span><small>${forForwarder ? 'Лучшая цена' : 'Лучшая цена'}</small><b>${best ? money(best.price, best.currency) : 'Пока нет'}</b></span><span><small>Предложений</small><b>${request.offers.length}</b></span><span><small>${request.status === 'active' ? 'До закрытия' : 'Статус'}</small><b>${request.status === 'active' ? timerLabel(request.timeLeft) : escapeHtml(statusLabel(request.status))}</b></span></div></section>`;
  }

  function infoCard(request) {
    return `<article class="info-card"><h3>Параметры груза</h3><div class="info-list"><div><span>Готовность</span><b>${escapeHtml(request.ready)}</b></div><div><span>Мест</span><b>${escapeHtml(request.places || '—')}</b></div><div><span>Тип логистики</span><b>${escapeHtml(request.logistics)}</b></div><div><span>Транспорт</span><b>${escapeHtml(request.transport)}</b></div><div><span>Услуги</span><b>${escapeHtml(request.services.join(', ') || 'Не указаны')}</b></div><div><span>Комментарий</span><b>${escapeHtml(request.details || 'Нет')}</b></div></div></article>`;
  }

  function offerRows(request, anonymized = false) {
    if (!request.offers.length) return `<div class="empty-state"><span>价</span><h2>Предложений пока нет</h2><p>Проверенные экспедиторы увидят заявку в ленте и смогут отправить условия.</p></div>`;
    const ordered = request.offers.slice().sort((a, b) => a.price - b.price);
    return `<div class="offers-table"><div class="offer-row head"><span>Компания</span><span>Стоимость</span><span>Срок</span><span>Транспорт</span><span>Условия</span><span></span></div>${ordered.map((offer, index) => {
      const label = anonymized && !offer.mine ? `Экспедитор №${index + 1}` : offer.company;
      const mark = anonymized && !offer.mine ? '匿' : offer.mark;
      return `<article class="offer-row ${index === 0 ? 'best' : ''}"><div class="company-cell"><i class="company-logo">${escapeHtml(mark)}</i><span><b>${escapeHtml(label)}${offer.mine ? ' · Вы' : ''}</b><small>${offer.verified ? '✓ проверена' : 'анонимно'}${index === 0 ? ' · лучшая цена' : ''}</small></span></div><span><b>${money(offer.price, offer.currency)}</b><small>${escapeHtml(offer.updated)}</small></span><span><b>${escapeHtml(offer.days)} дней</b><small>ориентировочно</small></span><span><b>${escapeHtml(offer.transport)}</b><small>${escapeHtml(offer.customs)}</small></span><span><b>${escapeHtml(offer.services.join(', '))}</b><small class="offer-comment">${escapeHtml(offer.comment || 'Комментарий не добавлен')}</small></span>${anonymized ? `<button class="button ghost small" ${offer.mine ? `data-open-bid="${escapeHtml(request.id)}"` : 'disabled'}>${offer.mine ? 'Изменить' : 'Анонимно'}</button>` : `<button class="button ${request.status === 'active' || request.status === 'waiting' ? 'dark' : 'ghost'} small" ${request.status === 'active' || request.status === 'waiting' ? `data-choose-offer="${escapeHtml(request.id)}:${escapeHtml(offer.id)}"` : 'disabled'}>${request.status === 'chosen' && request.chosenOfferId === offer.id ? 'Выбран' : 'Выбрать'}</button>`}</article>`;
    }).join('')}</div>`;
  }

  function clientRequestDetail(id) {
    const request = findRequest(id);
    if (!request) return notFound('Заявка не найдена', 'Вернитесь к списку и выберите другую заявку.', 'client/requests');
    const chosen = request.offers.find((offer) => offer.id === request.chosenOfferId);
    return `<div class="request-page"><div>${detailHero(request)}<div class="offer-toolbar"><div><h2>Предложения экспедиторов</h2><p>Цены в разных валютах не конвертируются автоматически</p></div><div class="view-toggle"><button class="active">Таблица</button><button>Карточки</button></div></div>${offerRows(request)}</div><aside class="detail-side">${infoCard(request)}${chosen ? `<article class="info-card"><h3>Выбранный исполнитель</h3><div class="company-cell"><i class="company-logo">${escapeHtml(chosen.mark)}</i><span><b>${escapeHtml(chosen.company)}</b><small>✓ контакты открыты</small></span></div><div class="info-list spaced"><div><span>WeChat</span><b>dragonbridge_cn</b></div><div><span>Телефон</span><b>+86 138 *** 5688</b></div><div><span>Сделка</span><b>Ожидает подтверждения</b></div></div><button class="button dark block" data-route="client/deals">Открыть сделку →</button></article>` : `<article class="info-card"><h3>Контакты защищены</h3><p>Контакты сторон откроются только после окончательного выбора конкретного предложения.</p></article>`}</aside></div>`;
  }

  function companiesView() {
    const companies = [
      ['Dragon Bridge','龙','Гуанчжоу','Карго · Авто · Ж/д','4,9','126'],
      ['Yunhe Logistics','云','Иу','Официальная · Ж/д · Таможня','4,8','89'],
      ['SinoLine','海','Шэньчжэнь','Море · Авиа · Авто','4,7','74'],
      ['EastRail Cargo','铁','Сиань','Официальная · Ж/д','4,8','62']
    ];
    return `<section class="panel table-panel data-panel"><div class="panel-head"><div><h2>Проверенные экспедиторы</h2><p>Компании, допущенные к торгам</p></div></div><form class="filters compact"><label><span>Город отправления</span><select><option>Весь Китай</option><option>Гуанчжоу</option><option>Иу</option><option>Шэньчжэнь</option></select></label><label><span>Вид логистики</span><select><option>Любой</option><option>Карго</option><option>Официальная</option></select></label><label><span>Транспорт</span><select><option>Все виды</option><option>Авто</option><option>Ж/д</option><option>Море</option><option>Авиа</option></select></label><label><span>Услуги</span><select><option>Любые</option><option>Таможня</option><option>Страхование</option><option>До двери</option></select></label><button class="button dark">Найти</button></form><div class="company-list-head"><span>Компания</span><span>Специализация</span><span>Рейтинг</span><span>Сделок</span><span></span></div><div class="company-list">${companies.map((company) => `<article class="company-row"><div class="company-cell"><i class="company-logo">${company[1]}</i><span><b>${company[0]}</b><small>${company[2]} · Китай · проверена</small></span></div><span class="company-services">${company[3]}</span><b>${company[4]}</b><b>${company[5]}</b><button class="button ghost small" data-action="company-profile">Профиль ${svgIcon('arrow', 15)}</button></article>`).join('')}</div></section>`;
  }

  function dealsView(role) {
    if (!state.deals.length) return notFound('Сделок пока нет', 'Сделка появится после выбора предложения грузовладельцем.', `${role}/dashboard`);
    return `<div class="request-list">${state.deals.map((deal) => {
      const request = findRequest(deal.requestId);
      const offer = request?.offers.find((item) => item.id === request.chosenOfferId);
      return `<article class="panel"><div class="panel-head"><div><h2>${escapeHtml(deal.id)} · ${escapeHtml(request?.from)} → ${escapeHtml(request?.to)}</h2><p>Связана с заявкой ${escapeHtml(deal.requestId)}</p></div><span class="status waiting">${escapeHtml(deal.status)}</span></div><div class="detail-stats on-light"><span><small>Исполнитель</small><b>${escapeHtml(offer?.company || 'Не выбран')}</b></span><span><small>Итоговая стоимость</small><b>${offer ? money(offer.price,offer.currency) : '—'}</b></span><span><small>Доставка</small><b>${escapeHtml(deal.delivery)}</b></span></div><div class="heading-actions deal-actions"><button class="button dark" data-action="confirm-deal">Подтвердить сделку</button><button class="button ghost" data-action="deal-details">Карточка сделки →</button></div></article>`;
    }).join('')}</div>`;
  }

  function notificationsView(role) {
    const items = role === 'client' ? [
      ['价','Новая цена по заявке HR-1048','Dragon Bridge обновила стоимость до 186 000 ₽','12 минут назад'],
      ['新','Новое предложение по HR-1051','EastRail Cargo предложила доставку за 21 день','18 минут назад'],
      ['时','Торги HR-1039 завершены','Выберите одно из двух актуальных предложений','1 час назад'],
      ['验','Компания прошла проверку','Yunhe Logistics доступна в каталоге','вчера']
    ] : [
      ['邀','Новое приглашение','Клиент приглашает к торгам по HR-1051','8 минут назад'],
      ['价','Ваша ставка сейчас лучшая','Предложение по HR-1048 лидирует по цене','12 минут назад'],
      ['时','До закрытия торгов 2 часа','Заявка HR-1048','5 часов назад']
    ];
    return `<section class="panel"><div class="panel-head"><div><h2>Центр уведомлений</h2><p>Непрочитанные события отмечены красным</p></div><button data-action="read-all">Прочитать все</button></div><div class="activity-list on-light">${items.map((item,index) => `<div class="activity-item"><i>${item[0]}</i><span><b>${item[1]}</b><small>${item[2]}</small></span><time>${item[3]}</time></div>`).join('')}</div></section>`;
  }

  function forwarderDashboard() {
    const matching = activeRequests();
    const mine = myOffers();
    const invited = matching.find((item) => item.id === 'HR-1051') || matching[0];
    const invitationCount = matching.some((item) => item.id === 'HR-1051') ? 1 : 0;
    return `<div class="overview-band"><section class="metric-strip" aria-label="Сводка"><article><small>Подходящие грузы</small><b>${matching.length}</b><em>открыты для ставок</em></article><article><small>Активные предложения</small><b>${mine.length}</b><em>текущие ставки</em></article><article><small>Приглашения</small><b>${invitationCount}</b><em>требуют ответа</em></article></section><article class="attention-card"><div class="attention-copy"><span>Новое приглашение</span><h2>${invited ? 'Предложить условия' : 'Проверить новые грузы'}</h2><p>${escapeHtml(invited?.id || 'Биржа грузов')} · ${escapeHtml(invited?.category || 'Открытые заявки')}</p></div>${invited ? routeSignature(invited, { compact: true, forwarder: true }) : ''}<button class="button primary" ${invited ? `data-open-bid="${escapeHtml(invited.id)}"` : 'data-route="forwarder/loads"'}>Ответить ${svgIcon('arrow', 16)}</button></article></div>
      <div class="workspace-grid"><section class="panel table-panel dashboard-table"><div class="panel-head"><div><h2>Подходящие грузы</h2><p>По маршрутам и профилю Dragon Bridge</p></div><button data-route="forwarder/loads">Все грузы ${svgIcon('arrow', 15)}</button></div><div class="load-list-head"><span>Маршрут</span><span>Груз</span><span>Готовность</span><span>Лучшая цена</span><span>До закрытия</span><span></span></div><div class="load-table">${matching.slice(0,3).map(loadTableRow).join('')}</div></section><aside class="work-rail"><section class="panel activity-panel"><div class="panel-head"><div><h2>События биржи</h2><p>Сегодня</p></div></div><div class="activity-list"><div class="activity-item"><i>${svgIcon('clipboard', 17)}</i><span><b>4 новых груза</b><small>Гуанчжоу, Иу и Шэньчжэнь</small></span><time>сегодня</time></div><div class="activity-item"><i>${svgIcon('bell', 17)}</i><span><b>Новое приглашение</b><small>Доставка оборудования в Казань</small></span><time>8 мин</time></div><div class="activity-item"><i>${svgIcon('bid', 17)}</i><span><b>Изменилась лучшая ставка</b><small>HR-1048 · участник скрыт</small></span><time>12 мин</time></div></div></section><section class="panel company-status"><div class="panel-head"><div><h2>Dragon Bridge</h2><p>Статус компании</p></div><span class="status active">Проверена</span></div><div class="info-list"><div><span>Доступ к торгам</span><b>Полный</b></div><div><span>Активных вариантов</span><b>${mine.length || 2} из 3</b></div></div><button class="button ghost" data-route="forwarder/verification">Профиль компании ${svgIcon('arrow', 15)}</button></section></aside></div>`;
  }

  function loadCard(request) {
    const best = bestOffer(request);
    return `<article class="load-card" data-open-load="${request.id}" tabindex="0"><div class="load-card-top"><span class="status ${request.id === 'HR-1051' ? 'waiting' : 'active'}">${request.id === 'HR-1051' ? '邀 Приглашение' : '● Идут торги'}</span><small>${request.id}</small></div><div class="load-route"><span><b>${escapeHtml(request.fromZh)}</b><small>${escapeHtml(request.from)}</small></span><i>→</i><span><b>${escapeHtml(request.toZh)}</b><small>${escapeHtml(request.to)}</small></span></div><div class="load-tags"><span>${request.weight} кг</span><span>${request.volume} м³</span><span>${escapeHtml(request.logistics)}</span><span>${escapeHtml(request.transport)}</span></div><dl><div><dt>Категория</dt><dd>${escapeHtml(request.category)}</dd></div><div><dt>Груз готов</dt><dd>${escapeHtml(request.ready)}</dd></div><div><dt>До закрытия</dt><dd>${timerLabel(request.timeLeft)}</dd></div></dl><div class="load-card-foot"><span><small>Текущая лучшая цена</small><b>${best ? money(best.price,best.currency) : 'Нет ставок'}</b></span><button data-open-bid="${request.id}">Сделать ставку / 报价</button></div></article>`;
  }

  function loadTableRow(request) {
    const best = bestOffer(request);
    return `<article class="load-row" data-open-load="${escapeHtml(request.id)}" tabindex="0"><div>${routeSignature(request, { compact: true, forwarder: true })}<small>${escapeHtml(request.id)}${request.id === 'HR-1051' ? ' · приглашение' : ''}</small></div><span><b>${escapeHtml(request.category)}</b><small>${escapeHtml(request.weight)} кг · ${escapeHtml(request.volume)} м³</small></span><span><b>${escapeHtml(request.ready)}</b><small>${escapeHtml(request.logistics)}</small></span><span><b>${best ? money(best.price,best.currency) : 'Нет ставок'}</b><small>${request.offers.length} предлож.</small></span><span><b>${timerLabel(request.timeLeft)}</b><small>${escapeHtml(request.transport)}</small></span><button class="button ghost small" data-open-bid="${escapeHtml(request.id)}">Ставка</button></article>`;
  }

  function loadsView() {
    const loads = activeRequests();
    return `<section class="panel table-panel data-panel"><div class="panel-head"><div><h2>Открытые заявки</h2><p>${loads.length} грузов по направлению Китай → Россия</p></div></div><form class="filters compact" id="loadFilters"><label><span>Откуда</span><select name="from"><option value="all">Весь Китай</option>${[...new Set(loads.map((item) => item.from))].map((value) => `<option>${escapeHtml(value)}</option>`).join('')}</select></label><label><span>Куда</span><select name="to"><option value="all">Вся Россия</option>${[...new Set(loads.map((item) => item.to))].map((value) => `<option>${escapeHtml(value)}</option>`).join('')}</select></label><label><span>Тип логистики</span><select name="logistics"><option value="all">Любой</option><option>Карго</option><option>Официальная</option></select></label><label><span>Сортировка</span><select><option>Сначала новые</option><option>Скоро завершатся</option><option>По весу</option></select></label><button class="button dark" type="submit">Найти</button></form><div class="load-list-head"><span>Маршрут</span><span>Груз</span><span>Готовность</span><span>Лучшая цена</span><span>До закрытия</span><span></span></div><div class="load-table" id="loadGrid">${loads.map(loadTableRow).join('')}</div></section>`;
  }

  function loadDetail(id) {
    const request = findRequest(id);
    if (!request) return notFound('Груз не найден', 'Вернитесь к бирже и выберите другую заявку.', 'forwarder/loads');
    return `<div class="load-detail"><div>${detailHero(request,true)}<div class="offer-toolbar"><div><h2>竞争报价 · Предложения участников</h2><p>Названия конкурентов скрыты до завершения торгов</p></div><button class="button primary" data-open-bid="${escapeHtml(request.id)}">＋ Сделать ставку / 报价</button></div>${offerRows(request,true)}</div><aside class="detail-side">${infoCard(request)}<article class="info-card"><h3>Правила торгов</h3><div class="info-list"><div><span>Ваших вариантов</span><b>${request.offers.filter((offer) => offer.mine).length} из 3</b></div><div><span>Изменение ставки</span><b>после таймера</b></div><div><span>Контакты клиента</span><b>скрыты</b></div></div><button class="button dark block" data-open-bid="${escapeHtml(request.id)}">Отправить предложение →</button></article></aside></div>`;
  }

  function myOffersView() {
    const offers = myOffers();
    if (!offers.length) return `<div class="empty-state"><span>价</span><h2>Вы ещё не отправляли предложений</h2><p>Откройте биржу грузов, выберите подходящую заявку и укажите цену, срок и условия.</p><button class="button primary" data-route="forwarder/loads">Перейти к грузам →</button></div>`;
    return `<div class="offer-list">${offers.map((offer) => `<article class="my-offer"><div><b>${escapeHtml(offer.request.from)} → ${escapeHtml(offer.request.to)}</b><small>${escapeHtml(offer.request.id)} · ${escapeHtml(offer.request.category)}</small></div><span><small>Ваша цена</small><b>${money(offer.price,offer.currency)}</b></span><span><small>Срок</small><b>${escapeHtml(offer.days)} дней</b></span><span><small>Статус</small><b class="status active">Активна</b></span><span><small>Изменение</small><b>доступно сейчас</b></span><button class="button ghost small" data-open-bid="${escapeHtml(offer.request.id)}">Изменить</button></article>`).join('')}</div>`;
  }

  function verificationView() {
    return `<div class="verification-layout"><section class="verification-card"><div class="verification-head"><span>验</span><div><h2>Dragon Bridge Logistics Co., Ltd.</h2><p>广州龙桥国际物流有限公司 · Гуанчжоу, Китай</p></div><span class="status active push-right">已认证 · Проверена</span></div><div class="verification-steps"><div class="verification-step done"><i>✓</i><span><b>Данные компании</b><small>Юридическое название, город и регистрационный код</small></span><em>Заполнено</em></div><div class="verification-step done"><i>✓</i><span><b>Регистрационные документы</b><small>Business License · Unified Social Credit Code</small></span><em>Проверено</em></div><div class="verification-step done"><i>✓</i><span><b>Контактное лицо</b><small>Телефон, email и WeChat</small></span><em>Подтверждено</em></div><div class="verification-step done"><i>✓</i><span><b>Профиль услуг</b><small>Маршруты, транспорт, категории и ограничения</small></span><em>Опубликовано</em></div></div></section><aside class="detail-side"><article class="info-card"><h3>Возможности аккаунта</h3><div class="info-list"><div><span>Просмотр заявок</span><b>Доступен</b></div><div><span>Отправка ставок</span><b>Доступна</b></div><div><span>Сотрудников</span><b>3</b></div><div><span>Тариф</span><b>Premium · тест</b></div></div></article><article class="info-card"><h3>Профиль услуг</h3><div class="load-tags"><span>Карго</span><span>Официальная</span><span>Авто</span><span>Ж/д</span><span>Море</span><span>Таможня</span><span>До двери</span></div><button class="button ghost block" data-action="edit-profile">Редактировать профиль</button></article></aside></div>`;
  }

  function notFound(title, text, route) {
    return `<div class="empty-state"><span>路</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p><button class="button primary" data-route="${route}">Вернуться →</button></div>`;
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
    form.elements.from.value = 'Гуанчжоу';
    form.elements.to.value = 'Москва';
    form.elements.weight.value = 420;
    form.elements.volume.value = 2.4;
    form.elements.places.value = 12;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    form.elements.ready.value = date.toISOString().slice(0, 10);
    updateWizard();
    openModal($('#requestWizard'));
  }

  function selectCargoPhoto(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      $('#cargoPhotoInput').value = '';
      showToast('Файл слишком большой', 'Максимальный размер — 10 МБ');
      return;
    }
    selectedCargoFile = file;
    if (cargoPreviewUrl) URL.revokeObjectURL(cargoPreviewUrl);
    cargoPreviewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    $('#cargoPhotoCopy').hidden = true;
    const preview = $('#cargoPhotoPreview');
    preview.hidden = false;
    preview.innerHTML = `${cargoPreviewUrl ? `<img src="${cargoPreviewUrl}" alt="">` : '<i>PDF</i>'}<span><b>${escapeHtml(file.name)}</b><small>${(file.size / 1024 / 1024).toFixed(1)} МБ · нажмите, чтобы заменить</small></span>`;
    applyPlatformLanguage(preview);
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
      ['Маршрут', `${data.from} → ${data.to}`], ['Груз', `${data.category} · ${data.weight} кг · ${data.volume} м³`],
      ['Готовность', data.ready], ['Логистика', `${data.logistics} · ${data.transport}`],
      ['Бюджет', data.budget ? `${Number(data.budget).toLocaleString('ru-RU')} ${data.currency}` : 'Не указан'],
      ['Срок торгов', `${data.auctionDuration} часов`]
    ].map(([label, value]) => `<div><small>${label}</small><b>${escapeHtml(value)}</b></div>`).join('');
  }

  function validateWizardStep() {
    const current = $(`.wizard-step[data-step="${wizardStep}"]`);
    const fields = $$('input,select,textarea', current);
    for (const field of fields) if (!field.reportValidity()) return false;
    return true;
  }

  async function publishRequest(event) {
    event.preventDefault();
    if (!validateWizardStep()) return;
    const data = requestFormData();
    const id = `HR-${state.requestCounter++}`;
    const request = {
      id, status: 'active', from: data.from, fromZh: data.from, to: data.to, toZh: data.to,
      category: data.category, weight: Number(data.weight), volume: Number(data.volume), places: Number(data.places || 0),
      ready: data.ready, logistics: data.logistics, transport: data.transport, auctionDuration: Number(data.auctionDuration),
      timeLeft: Number(data.auctionDuration) * 3600, budget: Number(data.budget || 0), currency: data.currency,
      services: data.services, details: data.details || '', offers: [], photoName: selectedCargoFile?.name || null
    };
    if (selectedCargoFile && window.HaoruAuth?.isConfigured) {
      const publishButton = $('#wizardPublish');
      publishButton.disabled = true;
      publishButton.textContent = state.language === 'zh' ? '正在上传…' : 'Загружаем фото…';
      try {
        const upload = await window.HaoruAuth.uploadCargoPhoto(selectedCargoFile, id);
        request.photoPath = upload.path;
      } catch (error) {
        publishButton.disabled = false;
        publishButton.textContent = state.language === 'zh' ? '发布需求 →' : 'Опубликовать заявку →';
        showToast('Фото не загружено', error.message);
        state.requestCounter -= 1;
        return;
      }
      publishButton.disabled = false;
      publishButton.textContent = state.language === 'zh' ? '发布需求 →' : 'Опубликовать заявку →';
    }
    state.requests.unshift(request);
    saveState();
    closeOverlays();
    showToast('Заявка опубликована', `${id} появилась в ленте экспедиторов`);
    go(`client/request/${id}`);
  }

  function saveDraft() {
    const data = requestFormData();
    const id = `DRAFT-${Date.now().toString().slice(-5)}`;
    state.requests.unshift({ id, status: 'draft', from: data.from || 'Не указано', fromZh: data.from || '', to: data.to || 'Не указано', toZh: data.to || '', category: data.category || 'Не указано', weight: Number(data.weight || 0), volume: Number(data.volume || 0), places: Number(data.places || 0), ready: data.ready || 'Не указано', logistics: data.logistics || 'Карго', transport: data.transport || 'Не важно', auctionDuration: Number(data.auctionDuration || 48), timeLeft: 0, budget: Number(data.budget || 0), currency: data.currency || 'RUB', services: data.services || [], details: data.details || '', offers: [] });
    saveState();
    closeOverlays();
    showToast('Черновик сохранён', 'Вернуться к нему можно в разделе «Мои заявки»');
    go('client/requests');
  }

  function openBidModal(requestId) {
    const request = findRequest(requestId);
    if (!request) return;
    selectedLoadId = requestId;
    const myExisting = request.offers.find((offer) => offer.mine);
    $('#selectedLoadSummary').innerHTML = `<b>${escapeHtml(request.fromZh)} ${escapeHtml(request.from)} → ${escapeHtml(request.toZh)} ${escapeHtml(request.to)}</b><small>${escapeHtml(request.id)} · ${escapeHtml(request.weight)} кг · ${escapeHtml(request.volume)} м³ · ${escapeHtml(request.category)}</small>`;
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
    const payload = { company: 'Dragon Bridge', mark: '龙', verified: true, rating: '4,9', price: Number(data.price), currency: data.currency, days: Number(data.days), transport: data.transport, customs: data.customs, services, comment: data.comment || '', updated: 'только что', mine: true };
    if (existing) Object.assign(existing, payload);
    else request.offers.push({ id: `OF-${Date.now().toString().slice(-6)}`, ...payload });
    saveState();
    closeOverlays();
    showToast(existing ? 'Предложение обновлено' : 'Предложение отправлено', `${money(payload.price,payload.currency)} · ${payload.days} дней`);
    go('forwarder/offers');
  }

  function openConfirm(requestId, offerId) {
    const request = findRequest(requestId);
    const offer = request?.offers.find((item) => item.id === offerId);
    if (!request || !offer) return;
    selectedOffer = { requestId, offerId };
    $('#confirmOfferSummary').innerHTML = `<div class="confirm-offer"><div><small>Компания</small><b>${escapeHtml(offer.company)}</b></div><div><small>Стоимость</small><b>${money(offer.price,offer.currency)}</b></div><div><small>Срок</small><b>${escapeHtml(offer.days)} дней</b></div><div><small>Маршрут</small><b>${escapeHtml(request.from)} → ${escapeHtml(request.to)}</b></div></div>`;
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
      state.deals.unshift({ id: `DL-${204 + state.deals.length}`, requestId: request.id, status: 'Ожидает подтверждения', delivery: 'Подготовка к перевозке', contactsOpen: true });
    }
    saveState();
    closeOverlays();
    showToast('Исполнитель выбран', 'Торги закрыты, контакты сторон открыты');
    render();
  }

  function filterRequests(form) {
    const data = Object.fromEntries(new FormData(form));
    const filtered = state.requests.filter((request) => {
      const query = (data.query || '').toLowerCase();
      return (data.status === 'all' || request.status === data.status)
        && (data.route === 'all' || request.to === data.route)
        && (!query || `${request.id} ${request.from} ${request.to}`.toLowerCase().includes(query));
    });
    $('#requestList').innerHTML = filtered.map(requestRow).join('') || `<div class="empty-state"><span>路</span><h2>Ничего не найдено</h2><p>Измените фильтры и попробуйте снова.</p></div>`;
    $('#requestResultCount').textContent = `Показано ${filtered.length}`;
  }

  function filterLoads(form) {
    const data = Object.fromEntries(new FormData(form));
    const filtered = activeRequests().filter((request) => (data.from === 'all' || request.from === data.from) && (data.to === 'all' || request.to === data.to) && (data.logistics === 'all' || request.logistics === data.logistics));
    $('#loadGrid').innerHTML = filtered.map(loadTableRow).join('') || `<div class="empty-state"><span>货</span><h2>Подходящих грузов пока нет</h2><p>Попробуйте изменить маршрут или тип логистики.</p></div>`;
    showToast('Фильтр применён', `Найдено заявок: ${filtered.length}`);
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
    if (profileAction === 'profile') { closeOverlays(); showToast('Профиль', 'Данные аккаунта загружены из регистрации'); }
    if (profileAction === 'settings') { closeOverlays(); showToast('Настройки', 'Язык интерфейса меняется кнопкой RU / 中文'); }
    if (profileAction === 'logout') {
      closeOverlays();
      window.HaoruAuth?.signOut().finally(() => { location.href = '../index.html?auth=login'; });
    }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'help') showToast('Подсказка', 'Сейчас используется закрытая тестовая версия платформы');
    if (action === 'company-profile') showToast('Профиль компании', 'В следующей итерации здесь появятся документы, маршруты и отзывы');
    if (action === 'read-all') showToast('Уведомления прочитаны', 'Новых событий нет');
    if (action === 'confirm-deal') showToast('Сделка подтверждена', 'Статус сделки обновлён');
    if (action === 'deal-details') showToast('Карточка сделки', 'Полный маршрут сделки добавим на следующем этапе');
    if (action === 'edit-profile') showToast('Редактирование профиля', 'В тестовом аккаунте компания уже прошла проверку');
  });

  document.addEventListener('submit', (event) => {
    if (event.target.id === 'requestWizardForm') publishRequest(event);
    if (event.target.id === 'bidForm') submitBid(event);
    if (event.target.id === 'requestFilters') { event.preventDefault(); filterRequests(event.target); }
    if (event.target.id === 'loadFilters') { event.preventDefault(); filterLoads(event.target); }
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
    if (!menu.hidden) applyPlatformLanguage(menu);
  });
  $('#cargoPhotoInput').addEventListener('change', (event) => selectCargoPhoto(event.target.files?.[0]));
  $('#languageButton').addEventListener('click', () => {
    state.language = state.language === 'ru' ? 'zh' : 'ru';
    saveState();
    render();
    applyPlatformLanguage();
    showToast(state.language === 'ru' ? 'Русский язык' : '中文界面', state.language === 'ru' ? 'Интерфейс переключён' : '界面已切换为中文');
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
      if (offline) showToast('Нет связи, попробуйте позже', 'Кабинет открыт по сохранённой сессии');
      const role = window.HaoruAuth.roleFromSession(authSession);
      if (!role) {
        await window.HaoruAuth.signOut();
        location.href = '../index.html?auth=login';
        return;
      }
      const route = parseRoute();
      if (route.gate || route.role !== role) {
        go(window.HaoruAuth.routeForRole(role));
        return;
      }
    }
    render();
  }

  bootstrap().catch((error) => {
    console.error(error);
    showToast('Не удалось открыть кабинет', error.message);
  });
})();
