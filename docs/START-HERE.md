# Как запустить Форсаж и работать с Git

Узеев Руслан Исмаилович, ЭФБО-05-25. Учебный проект КР №2 по практическим №9–11. Репозиторий создан в аккаунте [enjo1si](https://github.com/enjo1si/kr2-bootstrap-shop); подтверждённый статус трёх этапов приведён в VERIFICATION.md.

## Скачать проект с GitHub

Откройте Terminal → New Terminal в VS Code. Перейдите в папку, где хотите хранить проект. Например, в Finder перетащите нужную папку в терминал после набранного `cd ` и нажмите Enter.

Выполните по одной команде:

```sh
git clone https://github.com/enjo1si/kr2-bootstrap-shop.git
cd kr2-bootstrap-shop
git status
```

`clone` скачивает файлы и Git-историю. После завершения оформления проекта ожидается ветка `main` и сообщение `working tree clean`. Если папка с таким именем уже существует, клонируйте в новую:

```sh
git clone https://github.com/enjo1si/kr2-bootstrap-shop.git kr2-bootstrap-shop-git
cd kr2-bootstrap-shop-git
```

В VS Code выберите File → Open Folder… и откройте **новую папку, созданную clone**. Не путайте её с ранее распакованными исходниками из ZIP. `git init` здесь не нужен: история уже скачана.

## Запустить сайт

Откройте `index.html` в браузере через Finder. Для автоматического обновления установите в VS Code расширение Live Server автора Ritwick Dey, затем нажмите правой кнопкой на index.html → Open with Live Server. После редактирования сохраняйте файл через ⌘S.

Финальный сайт работает с локальными файлами Bootstrap и изображениями. Форма проверяет данные и считает стоимость, но не отправляет заявку и не бронирует место. Для проверки используйте вымышленные данные.

## Настроить автора собственных коммитов

В терминале **внутри проекта** задайте имя:

```sh
git config user.name "Узеев Руслан Исмаилович"
```

В своём GitHub откройте Settings → Emails и скопируйте подтверждённый адрес или показанный GitHub адрес noreply. Выполните команду, заменив пример своим адресом:

```sh
git config user.email "ВАШ_АДРЕС_ИЗ_GITHUB"
```

Не выполняйте строку с текстом-заглушкой. Здесь нет `--global`: меняются настройки только этого проекта. Подготовительные коммиты имеют технического автора `Project preparation`; они не выданы за собственные коммиты Руслана или владельца ноутбука.

Для чтения публичного репозитория вход не обязателен. Для отправки своих изменений авторизуйтесь в GitHub Desktop или предложенном браузерном входе именно в аккаунте enjo1si. Не вставляйте пароль или токен в код, README или чат.

## Разобраться в этапах №9–11

Работа разделена на три ветки. [PR №1](https://github.com/enjo1si/kr2-bootstrap-shop/pull/1) для сетки и [PR №2](https://github.com/enjo1si/kr2-bootstrap-shop/pull/2) для компонентов объединены в main. Финальные изменения передаются через PR из fix/kr2-final-check в main; его фактический статус проверяется во вкладке [Pull requests](https://github.com/enjo1si/kr2-bootstrap-shop/pulls) и в VERIFICATION.md. Не создавайте повторные PR для уже объединённых этапов.

| Этап | Ветка | Что изучить |
|---|---|---|
| №9 | feature/bootstrap-grid-page | Главная, CDN, hero, преимущества и сетка программ |
| №10 | feature/bootstrap-components | Каталог, описание, форма, navbar, card, modal и accordion |
| №11 | fix/kr2-final-check | Локальный Bootstrap, дополнительные страницы, проверки и простое оформление |

Чтобы посмотреть этап №9 отдельно, не переключая финальную рабочую папку:

```sh
git fetch origin
git worktree add --detach ../forsazh-stage9 origin/feature/bootstrap-grid-page
```

Откройте `../forsazh-stage9/index.html`. В этом раннем этапе Bootstrap подключён через CDN, поэтому нужен интернет. Не редактируйте эту копию вместо своего основного проекта.

Короткие пояснения к коду:

- `container` ограничивает ширину, `container-fluid` создаёт широкую область, `row` содержит колонки. `col-12` — вся строка, `col-md-6` — половина с 768 px, `col-lg-4` — треть с 992 px. Сетка состоит из 12 частей, `g-4` задаёт промежутки.
- `navbar` — шапка. `data-bs-target="#mainNav"` связывает кнопку с `id="mainNav"`. Текущий раздел выделяется классом active.
- `card` — карточка программы; `h-100` и flex выравнивают высоту и положение цены. `btn` — кнопка, badge — короткая метка, alert — пояснение.
- `modal` — окно выбора, accordion — раскрывающиеся вопросы. Меню, окно и FAQ требуют Bootstrap JS Bundle.
- `form-control` и `form-select` оформляют поля, input-group добавляет +7, form-check — согласие. `label for` совпадает с id поля. `table-responsive` удерживает таблицу в доступной ширине.
- `programs` в app.js хранит четыре программы. `URLSearchParams` читает `?program=kids` и переносит выбор между страницами. Два фильтра объединяют возраст и опыт.
- `sync()` пересчитывает стоимость и варианты времени. Цена = стоимость программы × число участников.
- `preventDefault()` останавливает обычную отправку. `checkValidity()` проверяет ограничения, `was-validated` включает сообщения Bootstrap. `textContent` выводит итог как текст.

В №11 базовый пример оценивается не более чем в 2,5 из 5. Доработки перечислены в README, но оценка зависит от понимания, объяснения и демонстрации студентом.

## Сделать свою проверку и коммит

Сначала обновите main:

```sh
git switch main
git pull --ff-only
git status
```

Откройте docs/CHECKLIST.md и отмечайте только лично выполненные пункты: `[ ]` → `[x]`. В Safari: Settings → Advanced → Show features for web developers → Develop → Enter Responsive Design Mode. Проверьте 375, 768, 1024 и 1440 px, меню, карточки, форму и таблицы. В Chrome DevTools: ⌥⌘I, режим устройств ⇧⌘M.

Создайте новую ветку:

```sh
git switch -c docs/my-browser-check
```

Отредактируйте чек-лист, сохраните ⌘S, затем выполните:

```sh
git diff
git add docs/CHECKLIST.md
git commit -m "docs: record browser checks"
git push -u origin docs/my-browser-check
```

`git add` подготавливает изменения, commit сохраняет историю, push отправляет её на GitHub. Простое ⌘S не отправляет код.

В GitHub: Pull requests → New pull request → base: main, compare: docs/my-browser-check. Опишите только выполненную проверку. Просмотрите Files changed, затем Merge pull request → Confirm merge. После объединения:

```sh
git switch main
git pull --ff-only
git status
git log --graph --oneline --all --decorate -12
```

## Запасной вариант из архива

Если GitHub временно недоступен, распакуйте полный комплект, содержащий `forsazh-history.bundle`. Обычная папка исходников из ZIP не содержит `.git`, поэтому `git status` в ней может показывать `not a git repository`.

Из папки, где лежит bundle, восстановите историю в **новую** папку:

```sh
git clone -b main forsazh-history.bundle kr2-bootstrap-shop-backup
cd kr2-bootstrap-shop-backup
git remote set-url origin https://github.com/enjo1si/kr2-bootstrap-shop.git
git status
```

Используйте обновлённый bundle из итогового комплекта. В раннем комплекте, подготовленном до PR, main содержала только начальный коммит, а финальные файлы лежали в fix/kr2-final-check. Если у вас такой старый комплект, переключитесь на `git switch fix/kr2-final-check` для просмотра; при появлении сети получите актуальный main с GitHub:

```sh
git fetch origin
git switch main
git pull --ff-only
```

Если папка с выбранным именем уже есть, укажите другое новое имя. Не удаляйте старую папку с собственными изменениями.

## Сдача и необязательная публикация

В СДО сдаётся [ссылка на репозиторий](https://github.com/enjo1si/kr2-bootstrap-shop). Проверьте, что итоговый сайт находится в main, PR этапов объединены, а исходники и README видны преподавателю. На защите покажите сетку, компоненты, доработки и историю.

GitHub Pages необязателен и требует отдельной проверки. Для публикации: Settings → Pages → Deploy from a branch → main → /(root) → Save. Дождитесь реальной ссылки, откройте страницы и добавьте проверенный адрес в README отдельным PR. Форма и там остаётся учебной.

КР №3 в конце методички №11 — отдельная работа на основе КР №1; здесь она не выполняется.
