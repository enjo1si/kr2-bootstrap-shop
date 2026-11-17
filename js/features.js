'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem('forsazh.' + key)) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem('forsazh.' + key, JSON.stringify(value)); return true; } catch { return false; } };
  const el = (tag, text, cls) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (cls) node.className = cls; return node; };
  let profile = read('profile', null);
  if (!profile || typeof profile.name !== 'string' || typeof profile.email !== 'string') profile = null;
  let active = read('active', false) === true && !!profile;
  const updateTheme = () => {
    const dark = document.documentElement.dataset.bsTheme === 'dark';
    $('themeToggle').setAttribute('aria-pressed', String(dark));
    $('themeToggle').setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
    $('themeLabel').textContent = dark ? 'Светлая тема' : 'Тёмная тема';
  };
  updateTheme();
  let themeTimer;
  $('themeToggle').addEventListener('click', () => {
    clearTimeout(themeTimer);
    document.documentElement.classList.add('theme-changing');
    document.documentElement.dataset.bsTheme = document.documentElement.dataset.bsTheme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('forsazh.theme', document.documentElement.dataset.bsTheme); } catch {}
    updateTheme();
    themeTimer = setTimeout(() => document.documentElement.classList.remove('theme-changing'), 700);
  });

  // Full-site local index; works without network requests, including file://.
  const pages = [
    ['Главная','index.html','Картинг-центр Форсаж, заезды и обучение'],
    ['Заезды и обучение','catalog.html','Каталог программ, цены, возраст и опыт'],
    ['Трассы и карты','tracks.html','Grand Loop Junior Loop, взрослые и детские карты, экипировка'],
    ['О центре и контакты','contacts.html','Телефон +7 (900) 123-45-67, info@forsazh-karting.ru, часы работы 10:00–21:00'],
    ['Как добраться','location.html','Адрес: Москва, Серпов переулок, 5. Карта и маршрут'],
    ['Бронирование','order.html','Выбрать программу, дату, время и участников'],
    ['Личный кабинет','account.html','Профиль, имя, почта, история заявок']
  ].map(([title,url,description]) => ({title,url,description}));
  Object.entries(programs).forEach(([id,item]) => pages.push({ title:item.title, url:`product.html?program=${id}`, description:`${item.description} ${item.age}, ${item.minutes} минут, ${item.price} ₽. ${item.track}` }));
  if ($('searchResults')) {
    const query = (new URLSearchParams(location.search).get('q') || '').slice(0,100).trim();
    $('siteQuery').value = query;
    const normalize = text => text.toLocaleLowerCase('ru').replaceAll('ё','е');
    const words = normalize(query).split(/\s+/).filter(Boolean);
    const results = words.length ? pages.filter(page => words.every(word => normalize(page.title+' '+page.description).includes(word))) : [];
    $('searchSummary').textContent = query ? `По запросу «${query}» найдено: ${results.length}` : 'Введи запрос в строку поиска наверху.';
    if (query && !results.length) $('searchResults').append(el('p','Ничего не найдено. Попробуй «детская», «трассы» или «контакты».'));
    results.forEach(item => {
      const col=el('div',undefined,'col-12 col-md-6'); const card=el('article',undefined,'card h-100'); const body=el('div',undefined,'card-body');
      const h=el('h2',undefined,'h5'); const link=el('a',item.title); link.href=item.url;
      h.append(link); body.append(h,el('p',item.description,'mb-0')); card.append(body); col.append(card); $('searchResults').append(col);
    });
  }
  function orders() { const list=read('orders',[]); return Array.isArray(list) ? list.filter(x => x && typeof x.title === 'string') : []; }
  function renderAccount() {
    if (!$('accountRoot')) return;
    const root=$('accountRoot'); root.replaceChildren();
    const panel=el('section',undefined,'profile-panel');
    panel.append(el('h2',active ? `Привет, ${profile.name}!` : 'Войти в учебный кабинет','h4'));
    const form=el('form');
    form.innerHTML='<label for="profileName">Имя</label><input class="form-control" id="profileName" maxlength="80" autocomplete="name" required><label for="profileEmail">Электронная почта</label><input class="form-control" id="profileEmail" type="email" maxlength="120" autocomplete="email" required><button class="btn btn-dark" type="submit"></button><p class="mt-3 mb-0" id="profileStatus" role="status"></p>';
    form.querySelector('button').textContent=active?'Сохранить профиль':'Войти';
    panel.append(form); root.append(panel);
    $('profileName').value=profile?.name || ''; $('profileEmail').value=profile?.email || '';
    $('profileName').addEventListener('input',()=> $('profileName').setCustomValidity($('profileName').value.trim()?'':'Введите имя'));
    form.addEventListener('submit',event=> {
      event.preventDefault();
      if (!$('profileName').value.trim()) { $('profileName').setCustomValidity('Введите имя'); $('profileName').reportValidity(); return; }
      profile={name:$('profileName').value.trim(),email:$('profileEmail').value.trim()}; active=true;
      const stored=save('profile',profile) && save('active',true); renderAccount();
      $('profileStatus').textContent=stored?'Профиль сохранён в этом браузере.':'Браузер запретил сохранение. Профиль доступен до закрытия страницы.';
    });
    if (!active) return;
    const logout=el('button','Выйти','btn btn-outline-dark ms-2'); logout.type='button';
    logout.addEventListener('click',()=> { active=false; save('active',false); renderAccount(); }); form.append(logout);
    const history=el('section',undefined,'profile-panel mt-4'); history.append(el('h2','История учебных заявок','h4'));
    const list=orders();
    if (!list.length) { history.append(el('p','Заявок пока нет. Выбери программу и заполни форму бронирования.')); const link=el('a','Выбрать заезд','btn btn-dark'); link.href='catalog.html'; history.append(link); }
    list.slice().reverse().forEach(order=> {
      const entry=el('article',undefined,'order-entry'); entry.append(el('h3',order.title,'h5'),el('p',`${order.date} · ${order.time} · Участников: ${order.people} · ${money(order.total)}`),el('p','Учебная заявка — реальное место не забронировано.','small text-body-secondary'));
      const remove=el('button','Удалить заявку','btn btn-outline-dark btn-sm'); remove.type='button'; remove.addEventListener('click',()=> { if (save('orders',orders().filter(x=>x.id!==order.id))) renderAccount(); else remove.textContent='Не удалось сохранить изменение'; }); entry.append(remove); history.append(entry);
    });
    root.append(history);
  }
  renderAccount();
  if (active && $('bookingForm')) { $('name').value=profile.name; $('email').value=profile.email; }
  window.addEventListener('forsazh:booking',event=> {
    const list=orders(); const item=event.detail;
    // Repeated validation of the same request must not duplicate history.
    const duplicate=list.some(x=>x.title===item.title && x.date===item.date && x.time===item.time && x.people===item.people);
    const ok=duplicate || save('orders',[...list,item].slice(-100));
    let note=$('savedBookingNote'); if (!note) { note=el('p',undefined,'mt-2'); note.id='savedBookingNote'; $('bookingResult').append(note); }
    note.textContent=ok?'Заявка сохранена в историю учебного кабинета на этом устройстве.':'Браузер не разрешил сохранить заявку.';
  });

  const launch=el('button','Чат поддержки','chat-launch'); launch.type='button'; launch.setAttribute('aria-haspopup','dialog');
  const dialog=el('dialog',undefined,'support-dialog'); dialog.setAttribute('aria-labelledby','supportTitle');
  dialog.innerHTML='<div class="chat-heading"><h2 id="supportTitle">Поддержка Форсаж</h2><button type="button" id="closeSupport" aria-label="Закрыть чат">×</button></div><p class="chat-note">Учебный бот · автоматические ответы. Сообщения не отправляются оператору.</p><div class="chat-log" id="chatLog" role="log" aria-live="polite" aria-label="Переписка с поддержкой"></div><div class="chat-quick"><button type="button">Цены</button><button type="button">Возраст</button><button type="button">Как добраться</button></div><form class="chat-form"><label class="visually-hidden" for="chatInput">Сообщение</label><input class="form-control" id="chatInput" placeholder="Напиши свой вопрос…" maxlength="500" required><button class="btn btn-dark" type="submit" aria-label="Отправить сообщение">➤</button></form><button class="chat-clear" type="button">Очистить переписку</button>';
  document.body.append(launch,dialog);
  let messages=read('chat',[]); if (!Array.isArray(messages)) messages=[];
  messages=messages.filter(x=>x && typeof x.text==='string' && ['bot','user'].includes(x.role)).slice(-60);
  if (!messages.length) messages=[{role:'bot',text:'Привет! Я учебный помощник Форсаж. Расскажу о ценах, программах, возрасте, бронировании и адресе.'}];
  function renderChat() { $('chatLog').replaceChildren(); messages.forEach(message=> $('chatLog').append(el('div',message.text,'chat-message'+(message.role==='user'?' mine':'')))); $('chatLog').scrollTop=$('chatLog').scrollHeight; }
  function answer(text) {
    if (/цен|стоим|сколько|тариф/i.test(text)) return 'Первый старт — 1 400 ₽; тренировка — 3 200 ₽; детская секция — 2 200 ₽; гоночный заезд — 2 400 ₽; марафон — 3 900 ₽; заезд с другом — 1 800 ₽. Цена за участника. Все программы есть в разделе «Заезды».';
    if (/дет|возраст|лет|реб[её]н/i.test(text)) return 'Детская секция — для 8–13 лет. Остальные программы — от 14 лет. Для гонки и марафона опыт нужен всем участникам.';
    if (/адрес|добрат|где|метро|карт[аеу]/i.test(text)) return 'Учебный адрес: Москва, Серпов переулок, 5. Схема проезда — на странице «Как добраться» (ссылка внизу сайта).';
    if (/врем|час|работ|расписан/i.test(text)) return 'Время работы: ежедневно 10:00–21:00. В учебной форме можно выбрать дату от завтра до 60 дней вперёд.';
    if (/брон|запис|заявк/i.test(text)) return 'Открой «Заезды», нажми «Выбрать», заполни форму и нажми «Проверить заявку». Заявка сохранится в истории кабинета. Реальное место не бронируется.';
    if (/кабинет|профил|войти|парол/i.test(text)) return 'Открой «Личный кабинет» в верхнем меню и введи вымышленные имя и почту. Пароль не нужен: это учебный профиль только в твоём браузере.';
    if (/оператор|человек|телефон|контакт/i.test(text)) return 'Я учебный бот, подключения к оператору нет. Демонстрационные контакты указаны в разделе «О центре».';
    if (/привет|здрав|спасибо/i.test(text)) return 'Рад помочь! Можешь спросить о ценах, возрасте участников, бронировании или адресе.';
    return 'Не нашёл готового ответа. Попробуй спросить о ценах, возрасте, часах работы или бронировании. Это учебный чат с автоматическими ответами.';
  }
  function send(text) { text=text.trim().slice(0,500); if (!text) return; messages.push({role:'user',text},{role:'bot',text:answer(text)}); messages=messages.slice(-60); save('chat',messages); renderChat(); $('chatInput').value=''; $('chatInput').focus(); }
  launch.addEventListener('click',()=> { dialog.showModal(); renderChat(); $('chatInput').focus(); });
  $('closeSupport').addEventListener('click',()=>dialog.close());
  dialog.querySelector('form').addEventListener('submit',event=> { event.preventDefault(); send($('chatInput').value); });
  dialog.querySelectorAll('.chat-quick button').forEach(button=>button.addEventListener('click',()=>send(button.textContent)));
  dialog.querySelector('.chat-clear').addEventListener('click',()=> { messages=[]; save('chat',[]); renderChat(); });
})();
