/* Данные учебного каталога. Реального расписания и отправки на сервер нет. */
'use strict';
const programs = {
  sprint: { title:'Первый старт', price:1400, minutes:10, age:'От 14 лет', min:14, max:99, experience:'beginner', track:'Grand Loop', description:'Разовый заезд на взрослом карте. Инструктаж и знакомство с трассой включены.' },
  training: { title:'Тренировка с инструктором', price:3200, minutes:30, age:'От 14 лет', min:14, max:99, experience:'all', track:'Grand Loop', description:'Разбор траектории, торможения и работы с рулём. Для первого знакомства и улучшения времени.' },
  kids: { title:'Детская секция', price:2200, minutes:30, age:'8–13 лет', min:8, max:13, experience:'beginner', track:'Junior Loop', description:'Вводное занятие на детском карте с инструктором. Группа 8–13 лет.' },
  race: { title:'Гоночный заезд', price:2400, minutes:20, age:'От 14 лет', min:14, max:99, experience:'experienced', track:'Grand Loop', description:'Квалификация и заезд для пилотов с опытом. Учебная программа соревнования.' }
};
const byId = id => document.getElementById(id);
const write = (id, value) => { if (byId(id)) byId(id).textContent = value; };
const money = value => `${value.toLocaleString('ru-RU')} ₽`;
const requested = new URLSearchParams(location.search).get('program');
const known = id => Object.hasOwn(programs, id);
// Обычные условия вместо вложенного короткого выражения.
function experienceLabel(item) {
  if (item.experience === 'experienced') {
    return 'У всех должен быть опыт';
  }
  if (item.experience === 'all') {
    return 'Любой опыт';
  }
  return 'Можно впервые';
}

// Фильтры комбинируются. При нуле результатов появляется сообщение.
if (byId('ageFilter')) {
  function filterCatalog() {
    let count = 0;
    document.querySelectorAll('.program-item').forEach(card => {
      const ageOK = byId('ageFilter').value === 'all' || card.dataset.age === byId('ageFilter').value;
      const level = byId('levelFilter').value;
      const experienceOK = level === 'all' || card.dataset.level === 'all' || card.dataset.level === level;
      card.hidden = !(ageOK && experienceOK);
      if (!card.hidden) count++;
    });
    write('filterCount', `Найдено программ: ${count}`);
    byId('emptyCatalog').hidden = count !== 0;
  }
  ['ageFilter','levelFilter'].forEach(id => byId(id).addEventListener('change', filterCatalog));
}

if (byId('programModal')) byId('programModal').addEventListener('show.bs.modal', event => {
  const id = event.relatedTarget?.dataset.program;
  if (!known(id)) return;
  const item = programs[id];
  write('modalProgram', `${item.title} · ${money(item.price)} за участника · ${item.minutes} мин · ${item.age}`);
  byId('modalOrder').href = `order.html?program=${id}`;
});

if (byId('programTitle')) {
  const id = known(requested) ? requested : 'sprint';
  const item = programs[id];
  write('programTitle', item.title); write('programDescription', item.description);
  write('programPrice', `${money(item.price)} / участник`);
  write('programBadge', `${item.age} · ${experienceLabel(item)}`);
  write('programDuration', `${item.minutes} минут`); write('programAge', item.age);
  write('programTrack', item.track); write('programLevel', experienceLabel(item));
  byId('programOrder').href = `order.html?program=${id}`;
  document.title = `${item.title} — Форсаж`;
}

const form = byId('bookingForm');
if (form) {
  const program = byId('program'), date = byId('date'), time = byId('time');
  const age = byId('age'), experience = byId('experience'), people = byId('people');
  const dateString = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  byId('submitBooking').disabled = false;
  if (known(requested)) program.value = requested;
  function hideResult() { byId('bookingResult').classList.add('d-none'); }
  function validateFields() {
    byId('name').setCustomValidity(byId('name').value.trim() ? '' : 'Введите имя.');
    byId('phone').setCustomValidity(byId('phone').value.replace(/\D/g,'').length === 10 ? '' : 'Введите 10 цифр без +7.');
    const item = programs[program.value];
    const ageNumber = Number(age.value);
    age.setCustomValidity(item && age.value && (ageNumber < item.min || ageNumber > item.max) ? `Возраст: ${item.age}.` : '');
    experience.setCustomValidity(item?.experience === 'experienced' && experience.value !== 'experienced' ? 'Для гонки опыт нужен всем.' : '');
  }
  function sync() {
    const now = new Date(), tomorrow = new Date(now), limit = new Date(now);
    tomorrow.setDate(now.getDate()+1); limit.setDate(now.getDate()+60);
    date.min = dateString(tomorrow); date.max = dateString(limit);
    date.setCustomValidity(date.value && (date.value < date.min || date.value > date.max) ? 'Выберите дату от завтра до 60 дней вперёд.' : '');
    const item = programs[program.value], previous = time.value;
    time.replaceChildren(new Option('Сначала выберите программу и дату', ''));
    if (item && date.value && date.validity.valid) {
      time.options[0].textContent = 'Выберите время';
      // Начало каждые полчаса. Продолжительность должна помещаться до 21:00.
      for (let minute=600; minute+item.minutes<=1260; minute+=30) {
        const label = `${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')}`;
        time.add(new Option(label,label));
      }
    }
    if ([...time.options].some(option => option.value === previous)) time.value = previous;
    const count = Number(people.value);
    write('estimate', item ? `Предварительно: ${money(item.price)} × ${count} = ${money(item.price*count)} · ${item.minutes} мин` : 'Выберите программу для расчёта стоимости.');
    validateFields();
  }
  [program,date,people].forEach(node => node.addEventListener('change', sync));
  form.addEventListener('input', () => { hideResult(); validateFields(); });
  form.addEventListener('change', () => { hideResult(); validateFields(); });
  form.addEventListener('submit', event => {
    event.preventDefault(); sync(); form.classList.add('was-validated');
    if (!form.checkValidity()) { form.querySelector(':invalid')?.focus(); return; }
    const item = programs[program.value], count = Number(people.value);
    const dateLabel = new Date(`${date.value}T12:00:00`).toLocaleDateString('ru-RU');
    // textContent выводит введённый текст без выполнения HTML.
    write('bookingSummary', `${byId('name').value.trim()}: ${item.title}, участников: ${count}, ${dateLabel} в ${time.value}. Предварительная сумма: ${money(item.price*count)}. Прибыть за 15 минут.`);
    byId('bookingResult').classList.remove('d-none'); byId('bookingResult').focus();
  });
  form.addEventListener('reset', () => {
    form.classList.remove('was-validated'); hideResult();
    form.querySelectorAll('input,select').forEach(node => node.setCustomValidity(''));
    setTimeout(sync,0); // Дождаться штатного сброса значений браузером.
  });
  sync();
}
