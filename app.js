(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const overlay = $('.overlay');
  let toastTimer;
  let siteLanguage = localStorage.getItem('haoru.site.language') || 'ru';

  const zh = {
    'contact.support':'技术支持','contact.phone':'电话：+7 (920) 657-72-70','nav.platform':'平台','nav.about':'关于我们','nav.clients':'货主','nav.forwarders':'货运代理','nav.login':'登录',
    'hero.eyebrow':'数字货运交易平台','hero.line1':'货运代理报价。','hero.line2':'由您比较。','hero.line3':'由您选择。','hero.lead':'经过审核的中国货运代理提供价格、时效与运输条件。您只需比较并选择最适合的方案。',
    'corridor.china':'中国','corridor.russia':'俄罗斯','corridor.text':'我们专注于中国至俄罗斯物流，覆盖货代运输与正规报关物流，包括海运、铁路、公路和航空。','corridor.metric1':'家货运<br>合作公司','corridor.metric2':'个以上报价<br>响应一份需求','corridor.metric3':'全天候<br>参与竞价',
    'how.line1':'我们让','how.line2':'跨境物流','how.line3':'更加透明。','how.intro':'一切始于一份需求。经过审核的货运代理提供价格、时效与运输条件，您可以在同一平台比较并选择合适方案。','how.step1.title':'发布需求','how.step1.text':'填写路线、货物参数与交付要求。','how.step2.title':'竞价','how.step2.text':'货运代理以价格和运输条件参与竞争。','how.step3.title':'选择','how.step3.text':'比较方案并选择合适的货运代理。',
    'roles.label':'选择您的角色','roles.line1':'每一方都有','roles.line2':'自己的路径','roles.line3':'都在 HAORU','roles.client.for':'面向从中国运输货物的企业','roles.client.line1':'我需要','roles.client.line2':'运输货物','roles.client.item1':'一次说明运输需求','roles.client.item2':'获得多家公司的报价','roles.client.item3':'比较价格、时效与服务内容','roles.forwarder.for':'面向中国货运代理与物流公司','roles.forwarder.line1':'我提供','roles.forwarder.line2':'货物运输','roles.forwarder.item1':'按自身线路查找运输需求','roles.forwarder.item2':'提供价格、时效与条件','roles.forwarder.item3':'寻找新客户','roles.register':'注册账户',
    'trust.label':'平台规则','trust.line1':'每一个细节','trust.line2':'都更安全。','trust.card1.title':'审核注册资料','trust.card1.text':'货运代理参与前需提交公司文件与注册信息。','trust.card2.title':'选择后开放联系方式','trust.card2.text':'选定货运代理前，双方通过平台沟通。','trust.card3.title':'保留报价记录','trust.card3.text':'价格、时效、服务内容及报价变更都会记录在 HAORU。',
    'cta.line1':'您位于路线的','cta.line2':'哪一端？','cta.client':'发布运输需求','cta.forwarder':'成为货运代理','footer.text':'中国 → 俄罗斯线路的<br>货运代理选择平台','footer.stage':'测试版本 · 2026',
    'auth.eyebrow':'HAORU 账户','auth.registerTitle':'注册','auth.registerTab':'注册','auth.loginTab':'登录','auth.selectedRole':'已选择角色','auth.fullName':'姓名 *','auth.company':'公司名称 *','auth.city':'中国城市 *','auth.phone':'联系电话 *','auth.password':'密码 *','auth.consent':'我接受平台规则并同意处理注册数据。','auth.create':'创建账户','auth.enter':'进入平台','auth.security':'账户角色固定，并决定可进入的工作台。',
    'about.eyebrow':'关于平台','about.hero1':'一份需求。','about.hero2':'多个方案。','about.hero3':'清晰选择。','about.lead':'HAORU 将俄罗斯货主与中国货运代理连接在同一数字平台，让国际物流更加透明、便捷。','about.missionLabel':'我们的角色','about.missionTitle':'我们创建交易市场，而不是亲自运输货物。','about.missionText1':'货主只需发布一份需求，即可获得多家物流公司的竞争报价，并比较价格、时效与运输条件。','about.missionText2':'平台同时覆盖货代运输和含报关的正规国际物流。选定承运方后，双方可直接继续合作。','about.problemLabel':'问题与解决方案','about.problemTitle':'跨境物流不应从几十次零散谈判开始。','about.problem1Title':'寻找','about.problem1Text':'进口商需要自行寻找承运方，并与每家公司重复沟通。','about.problem2Title':'不透明','about.problem2Text':'价格、时效和服务内容难以在同一标准下比较。','about.problem3Title':'信任','about.problem3Text':'核验承运方可靠性需要时间和专业知识。','about.solutionTitle':'HAORU','about.solutionText':'一份需求即可开启竞争报价，并在统一报价卡中比较关键条件。','about.valueLabel':'为双方创造价值','about.valueTitle':'两类用户，一套清晰的协作系统。','about.clientTitle':'货主','about.client1':'统一寻找物流服务','about.client2':'一份需求获得多个报价','about.client3':'比较价格、时效与服务内容','about.client4':'已核验注册资料的公司','about.forwarderTitle':'货运代理','about.forwarder1':'获得新的获客渠道','about.forwarder2':'查看实时运输需求','about.forwarder3':'自主选择感兴趣的订单','about.forwarder4':'参与竞争报价','about.roadmapLabel':'平台发展','about.roadmapTitle':'第一步，夯实中国 → 俄罗斯线路基础。','about.roadmapText':'首个版本专注于需求、报价、比较与选择。电子单证、内置沟通和跨境支付将在后续阶段推出。','about.stage1':'需求、竞价、公司审核与选择','about.stage2Title':'沟通','about.stage2':'内置消息与完整互动记录','about.stage3Title':'结算','about.stage3':'电子单证与跨境支付服务',
    'nav.how':'如何运作','nav.forWhom':'适用对象','nav.security':'安全保障','nav.start':'开始使用',
    'newHero.kicker':'中国货运 B2B 市场平台','newHero.title':'比较货运代理报价，<br>选择从中国出发的<br><em>运输条件</em>','newHero.text':'只需说明一次货物信息。已核验注册资料的公司将提供价格、时效与服务内容，并以统一格式呈现。','newHero.clientCta':'发布运输需求','newHero.forwarderCta':'我是货运代理','newHero.proof1':'核验公司注册资料','newHero.proof2':'统一格式展示报价',
    'demo.label':'界面演示','demo.request':'运输需求 HR-1048','demo.auction':'接收报价中','demo.cargo':'货物','demo.type':'运输类型','demo.ready':'可发货日期','demo.offers':'货运代理报价','demo.verified':'注册资料已核验','demo.price':'价格','demo.term':'时效','demo.bestPrice':'最低价格','demo.fastest':'最短时效','demo.saving':'价格差异','demo.choice':'由您选择','demo.compare':'比较并选择','demo.caption':'价格与时效仅供示例。',
    'scope.route':'中国 → 俄罗斯','scope.text':'货代运输与正规报关物流','scope.rail':'铁路','scope.auto':'公路','scope.sea':'海运','scope.air':'空运',
    'newHow.kicker':'HAORU 如何运作','newHow.title':'从运输需求<br>到选定货运代理','newHow.text':'HAORU 汇集同一需求的报价，并以统一格式展示价格、时效与服务内容。货运代理由您选择。','newHow.step1Title':'说明运输需求','newHow.step1Text':'填写路线、货物参数与所需服务。','newHow.step2Title':'获取货运代理报价','newHow.step2Text':'公司提供价格、时效与运输服务内容。','newHow.step3Title':'比较条件并选择','newHow.step3Text':'以统一格式比较报价并选择货运代理。',
    'compare.kicker':'报价比较','compare.title':'价格、时效与服务<br><em>一次比较清楚</em>','compare.text':'运输价格、所需时间及报价所含服务一目了然，包括报关、送货到地址等条件。','compare.cta':'发布运输需求','compare.parameter':'参数','compare.optimal':'最低价格','compare.transport':'运输方式','compare.customs':'报关','compare.included':'已包含','compare.separate':'另计','compare.delivery':'送货到地址','compare.choose':'选择','compare.details':'查看详情',
    'rolesNew.kicker':'面向货主与货运代理','rolesNew.title':'货主拥有选择。<br>货运代理获得新需求。','rolesNew.text':'企业比较运输条件，货运代理查找匹配需求并提供服务。','rolesNew.clientTitle':'寻找<br>货运代理','rolesNew.forwarderTitle':'获取<br>运输需求','rolesNew.clientCta':'发布运输需求','rolesNew.forwarderCta':'成为货运代理','rolesNew.myRequests':'我的需求','rolesNew.newRequest':'新建','rolesNew.active':'进行中','rolesNew.offersShort':'个报价','rolesNew.cargoFeed':'运输需求','rolesNew.filter':'筛选','rolesNew.newCargo':'新需求','rolesNew.budget':'预算','rolesNew.offer':'提供运输条件',
    'trustNew.kicker':'审核与透明','trustNew.title':'选定货运代理前<br>规则清晰','ctaNew.kicker':'从一份需求开始','ctaNew.title':'一份需求 —<br>多个运输方案','ctaNew.text':'比较货运代理报价，选择适合的运输条件。','ctaNew.forwarder':'成为货运代理',
    'aboutNew.kicker':'关于 HAORU','aboutNew.heroTitle':'选择中国货运代理的<br><em>统一平台</em>','aboutNew.heroText':'HAORU 连接俄罗斯企业与中国货运代理。发布一份需求，比较价格、时效与服务内容，并选择合适的合作伙伴。','aboutNew.seePlatform':'了解 HAORU 如何运作','aboutNew.ourRole':'我们的角色',
    'aboutNew.system':'HAORU 如何运作','aboutNew.cargoOwner':'货主','aboutNew.oneRequest':'发布运输需求','aboutNew.core':'HAORU 将报价统一格式化','aboutNew.coreSub':'价格 · 时效 · 服务','aboutNew.offer':'货运代理提供价格、时效与服务','aboutNew.result':'结果','aboutNew.resultText':'由您比较并选择',
    'aboutNew.missionTitle':'我们不亲自运输货物。<br><em>我们帮助您选择货运代理。</em>','aboutNew.missionLead':'HAORU 是面向货主与货运代理的数字平台。我们帮助描述运输需求、汇集报价，并在选择合作伙伴前进行比较。','aboutNew.mission1Title':'帮助说明运输需求','aboutNew.mission1Text':'路线、货物参数与所需服务记录在一份需求中。','aboutNew.mission2Title':'汇集多个报价','aboutNew.mission2Text':'货运代理提供各自的价格、时效与服务内容。','aboutNew.mission3Title':'展示差异','aboutNew.mission3Text':'您以统一格式比较方案，并自主选择货运代理。',
    'aboutNew.shiftTitle':'一份需求，替代<br><em>多个聊天中的沟通</em>','aboutNew.shiftText':'只需说明一次运输需求。货运代理以统一格式回复，方便您比较价格、时效与服务内容。','aboutNew.before':'聊天中的沟通','aboutNew.after':'HAORU 中的一份需求','aboutNew.chat1':'到莫斯科的报价是多少？','aboutNew.chatSub1':'单独沟通','aboutNew.chat2':'时效多久，包含哪些服务？','aboutNew.chatSub2':'回答格式各不相同','aboutNew.chat3':'是否包含报关？','aboutNew.chatSub3':'需要进一步确认','aboutNew.beforeCaption':'信息需要手动收集和比较。','aboutNew.afterCaption':'价格、时效与服务内容以统一格式呈现。','aboutNew.days':'天',
    'aboutNew.principlesKicker':'产品原则','aboutNew.principlesTitle':'统一格式展示报价。<br>选择由您作出。','aboutNew.principle1Title':'聚焦中国 → 俄罗斯线路','aboutNew.principle1Text':'考虑两国之间运输的实际特点。','aboutNew.principle3Title':'统一的报价格式','aboutNew.principle3Text':'价格、时效与服务内容按同一结构展示。','aboutNew.principle4Title':'由您选择货运代理','aboutNew.principle4Text':'平台展示差异，但不会代替货主作出决定。',
    'about.client2':'获取多家公司的报价','about.client3':'比较价格、时效与服务内容','about.client4':'选择注册资料已核验的货运代理','about.forwarder2':'查看自身线路的运输需求','about.forwarder3':'选择感兴趣的运输任务','about.forwarder4':'提供自己的运输条件',
    'aboutNew.rolesTitle':'货主找到货运代理。<br><em>货运代理找到匹配需求。</em>','aboutNew.rolesText':'HAORU 帮助双方更快从寻找转入具体运输需求的沟通。','aboutNew.forOwners':'面向货主','aboutNew.ownerValue':'一次说明运输需求','aboutNew.forForwarders':'面向货运代理','aboutNew.forwarderValue':'查找匹配的运输需求',
    'aboutNew.currentKicker':'当前可用功能','aboutNew.currentTitle':'货运代理选择，全程一个流程','aboutNew.currentText':'测试版本已支持核心流程：发布需求、获取报价、比较条件并选择货运代理。','aboutNew.currentStep1':'发布运输需求','aboutNew.currentStep2':'获取报价','aboutNew.currentStep3':'比较并选择','aboutNew.current1':'路线、货物与所需服务','aboutNew.current2':'价格、时效与服务内容','aboutNew.current3':'货运代理由货主选择','aboutNew.ctaTitle':'获取报价<br>并选择货运代理','aboutNew.ctaText':'从一份中国运输需求开始。'
  };

  function applySiteLanguage() {
    document.documentElement.lang = siteLanguage === 'zh' ? 'zh-CN' : 'ru';
    $$('[data-i18n]').forEach((element) => {
      if (!element.dataset.ruHtml) element.dataset.ruHtml = element.innerHTML;
      element.innerHTML = siteLanguage === 'zh' ? (zh[element.dataset.i18n] || element.dataset.ruHtml) : element.dataset.ruHtml;
    });
    $$('[data-action="language"]').forEach((button) => {
      button.innerHTML = siteLanguage === 'zh' ? '中文 <span>/ RU</span>' : 'RU <span>/ 中文</span>';
    });
    const currentRole = $('#registerForm')?.elements?.role?.value;
    if (currentRole) setAuthRole(currentRole);
  }

  function setAuthRole(role = 'client') {
    const form = $('#registerForm');
    if (!form) return;
    form.elements.role.value = role;
    const forwarder = role === 'forwarder';
    $$('.forwarder-only', form).forEach((block) => { block.hidden = !forwarder; });
    ['company','city'].forEach((name) => { if (form.elements[name]) form.elements[name].required = forwarder; });
    if ($('#authRoleMark')) $('#authRoleMark').textContent = forwarder ? '运' : '货';
    if ($('#authRoleName')) $('#authRoleName').textContent = siteLanguage === 'zh'
      ? (forwarder ? '货运代理' : '货主')
      : (forwarder ? 'Экспедитор' : 'Грузовладелец');
  }

  function switchAuthMode(mode) {
    const register = mode !== 'login';
    if ($('#registerForm')) $('#registerForm').hidden = !register;
    if ($('#loginForm')) $('#loginForm').hidden = register;
    $$('.auth-tabs button').forEach((button) => button.classList.toggle('active', button.dataset.authMode === mode));
    if ($('#authTitle')) $('#authTitle').textContent = siteLanguage === 'zh'
      ? (register ? '注册' : '登录')
      : (register ? 'Регистрация' : 'Вход в HAORU');
  }

  function openAuth(role = 'client', mode = 'register') {
    setAuthRole(role);
    switchAuthMode(mode);
    openPanel($('#authModal'));
  }

  function formMessage(id, text, type = 'error') {
    const message = $(id);
    if (!message) return;
    message.textContent = text;
    message.className = `form-message ${type}`;
  }

  const showToast = (title, message) => {
    const toast = $('#toast');
    if (!toast) return;
    $('b', toast).textContent = title;
    $('small', toast).textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  };

  const openPanel = (panel) => {
    if (!panel) return;
    panel.hidden = false;
    if (overlay) overlay.hidden = false;
    document.body.classList.add('no-scroll');
    const first = $('input, select, textarea, button', panel);
    setTimeout(() => first?.focus(), 80);
  };

  const closePanels = () => {
    $$('.modal, .drawer').forEach((panel) => panel.hidden = true);
    if (overlay) overlay.hidden = true;
    document.body.classList.remove('no-scroll');
  };

  const openAuction = (number) => {
    const modal = $('#auctionModal');
    if (!modal) return;
    const second = String(number) === '2';
    $('#auctionTitle').textContent = second ? 'Шэньчжэнь → Казань' : 'Гуанчжоу → Москва';
    $('#auctionMeta').innerHTML = second
      ? '<span>1 850 кг · 6 м³</span><span>Оборудование</span><span>Официальная</span>'
      : '<span>420 кг · 2,4 м³</span><span>Маркетплейсы</span><span>Карго</span>';
    openPanel(modal);
  };

  const setReadyDate = () => {
    const field = $('input[name="ready"]');
    if (!field || field.value) return;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    field.value = date.toISOString().slice(0, 10);
  };
  setReadyDate();

  document.addEventListener('click', async (event) => {
    const close = event.target.closest('[data-close]');
    if (close) { event.preventDefault(); closePanels(); return; }

    const authRole = event.target.closest('[data-auth-role]');
    if (authRole) { event.preventDefault(); openAuth(authRole.dataset.authRole, 'register'); return; }

    const authMode = event.target.closest('[data-auth-mode]');
    if (authMode) { event.preventDefault(); switchAuthMode(authMode.dataset.authMode); return; }

    const mobileNav = event.target.closest('.mobile-nav');
    if (mobileNav) { event.preventDefault(); $('.topbar')?.classList.toggle('nav-open'); return; }

    const auction = event.target.closest('[data-auction]');
    if (auction) { event.preventDefault(); openAuction(auction.dataset.auction); return; }

    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;
    const action = actionElement.dataset.action;

    if (action === 'login') {
      const session = await window.HaoruAuth?.getSession?.();
      const role = window.HaoruAuth?.roleFromSession?.(session);
      if (session && role) location.href = `app/#/${window.HaoruAuth.routeForRole(role)}`;
      else openAuth('client', 'login');
    }
    if (action === 'create') { closePanels(); setReadyDate(); openPanel($('#createModal')); }
    if (action === 'drawer') {
      const drawer = $('#drawer');
      drawer ? openPanel(drawer) : showToast('Личный кабинет', 'Появится после входа в аккаунт');
    }
    if (action === 'bid') {
      const route = actionElement.dataset.route || 'Гуанчжоу → Москва';
      if ($('#bidRoute')) $('#bidRoute').textContent = route;
      openPanel($('#bidModal'));
    }
    if (action === 'verify') openPanel($('#verifyModal'));
    if (action === 'language') {
      siteLanguage = siteLanguage === 'ru' ? 'zh' : 'ru';
      localStorage.setItem('haoru.site.language', siteLanguage);
      applySiteLanguage();
      showToast(siteLanguage === 'zh' ? '已切换为中文' : 'Русский язык', siteLanguage === 'zh' ? '网站内容已切换为中文' : 'Весь сайт переключён на русский');
    }
    if (action === 'draft') { closePanels(); showToast('Черновик сохранён', 'Вернуться к нему можно в личном кабинете'); }
    if (action === 'company') showToast('Профиль компании', 'В полной версии здесь будут документы, отзывы и сделки');
    if (action === 'choose') { closePanels(); showToast('Экспедитор выбран', 'Контакты сторон откроются после подтверждения'); }
    if (action === 'auth') { closePanels(); showToast('Демо-режим', 'Авторизация появится после подключения кабинета'); }
    if (action === 'premium') showToast('Premium', 'Оставили запрос — менеджер пришлёт условия после проверки');
    if (action === 'more') showToast('23 заявки', 'В полной версии список подгрузится без перезагрузки');
  });

  overlay?.addEventListener('click', closePanels);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closePanels(); });

  $('#swapRoute')?.addEventListener('click', () => {
    const from = $('#fromCity');
    const to = $('#toCity');
    [from.value, to.value] = [to.value, from.value];
  });

  $('#routeForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const modal = $('#createModal');
    if (!modal) return;
    modal.elements?.from && (modal.elements.from.value = $('#fromCity').value);
    const form = $('#requestForm');
    if (form) {
      form.elements.from.value = $('#fromCity').value;
      form.elements.to.value = $('#toCity').value;
      form.elements.category.value = $('#cargoType').value;
      form.elements.weight.value = $('#cargoWeight').value;
    }
    setReadyDate();
    openPanel(modal);
  });

  $('#requestForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const stored = JSON.parse(localStorage.getItem('haoruRequests') || '[]');
    stored.push({ ...formData, createdAt: new Date().toISOString() });
    localStorage.setItem('haoruRequests', JSON.stringify(stored));
    const count = $('#requestCount');
    if (count) count.textContent = String(2 + stored.length);
    closePanels();
    showToast('Заявка создана', 'Она появилась в списке ваших заявок');
  });

  const savedRequests = JSON.parse(localStorage.getItem('haoruRequests') || '[]');
  if ($('#requestCount')) $('#requestCount').textContent = String(2 + savedRequests.length);

  $('#bidForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    closePanels();
    showToast('Предложение отправлено', 'Грузовладелец увидит его в своей заявке');
  });

  $('#verifyForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    closePanels();
    showToast('Данные сохранены', 'Следующий шаг — документы компании');
  });

  $('#registerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = $('button[type="submit"]', form);
    const data = Object.fromEntries(new FormData(form));
    if (!window.HaoruAuth?.isConfigured) {
      formMessage('#registerMessage', siteLanguage === 'zh' ? '注册界面已准备好。连接 Supabase 项目后即可创建真实账户。' : 'Форма готова. Для создания реального аккаунта осталось подключить проект Supabase.');
      return;
    }
    submit.disabled = true;
    formMessage('#registerMessage', siteLanguage === 'zh' ? '正在创建账户…' : 'Создаём аккаунт…', 'pending');
    try {
      const result = await window.HaoruAuth.signUp(data);
      if (result.session) {
        formMessage('#registerMessage', siteLanguage === 'zh' ? '账户已创建。正在打开工作台…' : 'Аккаунт создан. Открываем кабинет…', 'success');
        location.href = `app/#/${window.HaoruAuth.routeForRole(data.role)}`;
      } else {
        formMessage('#registerMessage', siteLanguage === 'zh' ? '请检查邮箱并确认注册，然后登录。' : 'Проверьте почту и подтвердите регистрацию, затем войдите.', 'success');
        switchAuthMode('login');
        $('#loginForm').elements.email.value = data.email;
      }
    } catch (error) {
      formMessage('#registerMessage', error.message);
    } finally { submit.disabled = false; }
  });

  $('#loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = $('button[type="submit"]', form);
    const data = Object.fromEntries(new FormData(form));
    if (!window.HaoruAuth?.isConfigured) {
      formMessage('#loginMessage', siteLanguage === 'zh' ? '连接 Supabase 项目后即可使用真实登录。' : 'Настоящий вход станет доступен после подключения проекта Supabase.');
      return;
    }
    submit.disabled = true;
    formMessage('#loginMessage', siteLanguage === 'zh' ? '正在登录…' : 'Выполняем вход…', 'pending');
    try {
      const session = await window.HaoruAuth.signIn(data);
      const role = window.HaoruAuth.roleFromSession(session);
      formMessage('#loginMessage', siteLanguage === 'zh' ? '登录成功。' : 'Вход выполнен.', 'success');
      location.href = `app/#/${window.HaoruAuth.routeForRole(role)}`;
    } catch (error) {
      formMessage('#loginMessage', error.message);
    } finally { submit.disabled = false; }
  });

  $$('.workspace-tabs [data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.workspace-tabs [data-filter]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      $$('.company-card').forEach((card) => {
        card.hidden = filter !== 'all' && !card.dataset.tags.includes(filter);
      });
    });
  });

  $('#loadFilters')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    let shown = 0;
    $$('.load-card').forEach((card) => {
      const visible = (data.origin === 'all' || data.origin === card.dataset.origin)
        && (data.destination === 'all' || data.destination === card.dataset.destination)
        && (data.transport === 'all' || data.transport === card.dataset.transport);
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    showToast('Фильтр применён', shown ? `Найдено заявок: ${shown}` : 'Подходящих демо-заявок пока нет');
  });

  const tickTimers = () => {
    $$('.timer').forEach((timer) => {
      let value = Number(timer.dataset.seconds || 0);
      value = Math.max(0, value - 1);
      timer.dataset.seconds = String(value);
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = value % 60;
      timer.textContent = [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
    });
  };
  tickTimers();
  setInterval(tickTimers, 1000);

  applySiteLanguage();
  const authParams = new URLSearchParams(location.search);
  if (authParams.get('auth') && $('#authModal')) {
    openAuth(authParams.get('role') === 'forwarder' ? 'forwarder' : 'client', authParams.get('auth') === 'login' ? 'login' : 'register');
  }
})();
