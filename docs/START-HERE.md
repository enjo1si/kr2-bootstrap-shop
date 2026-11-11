# Как запустить Форсаж и оформить КР №2

Узеев Руслан Исмаилович, ЭФБО-05-25. Практические №9–11. Архив подготовлен на другом компьютере; все шаги ниже Руслан выполняет в своей копии проекта и своём аккаунте GitHub.

## 1. Посмотреть сайт

Распакуйте `forsazh-ruslan-kr2.zip`. Внутри есть `kr2-bootstrap-shop` с финальным сайтом, `forsazh-history.bundle` с историей Git и короткий файл НАЧНИ-ЗДЕСЬ.txt.

Откройте папку `kr2-bootstrap-shop` в VS Code: File → Open Folder… . Откройте `index.html` в браузере через Finder. Для автоматического обновления установите расширение Live Server автора Ritwick Dey из Marketplace VS Code, затем нажмите на index.html правой кнопкой → Open with Live Server. При изменениях сохраняйте файл через ⌘S.

Это локальный сайт. Заявки никуда не отправляются. Для проверки вводите вымышленные данные. Интернет для финального сайта не нужен: Bootstrap и изображения находятся в папке проекта.

## 2. Восстановить Git перед изменением кода

Обычный ZIP исходников не содержит `.git`. Если запустить `git status` в папке исходников, ошибка `not a git repository` ожидаема. Не выполняйте `git init`, если хотите сохранить уже подготовленные этапы.

В VS Code откройте Terminal → New Terminal. Перейдите в папку распакованного комплекта, где лежит `forsazh-history.bundle`. Можно в Finder перетащить эту папку в терминал после набранного `cd ` и нажать Enter. Проверьте содержимое:

```sh
pwd
ls
```

Создайте новую рабочую папку вместе с историей:

```sh
git clone -b fix/kr2-final-check forsazh-history.bundle kr2-bootstrap-shop-git
cd kr2-bootstrap-shop-git
git status
```

Ожидается ветка `fix/kr2-final-check` и `working tree clean`. Теперь **откройте именно `kr2-bootstrap-shop-git`** в VS Code через File → Open Folder… . Не продолжайте редактировать старую папку из ZIP. Оригинальная папка остаётся запасной копией.

Подготовьте локальные имена остальных веток:

```sh
git branch main origin/main
git branch feature/bootstrap-grid-page origin/feature/bootstrap-grid-page
git branch feature/bootstrap-components origin/feature/bootstrap-components
git branch -a
git log --graph --oneline --all --decorate
```

Если команда сообщает, что ветка уже существует, пропустите только её. Рабочая версия пока остаётся в `fix/kr2-final-check`; `main` содержит лишь начальный коммит, чтобы в GitHub можно было создать PR для каждого этапа.

## 3. Настроить имя для будущих собственных коммитов

Внутри `kr2-bootstrap-shop-git` выполните:

```sh
git config user.name "Узеев Руслан Исмаилович"
```

Откройте свой GitHub → Settings → Emails. Скопируйте свой подтверждённый адрес или показанный GitHub адрес noreply. В следующей команде **замените пример** своим адресом:

```sh
git config user.email "ВАШ_АДРЕС_ИЗ_GITHUB"
```

Не выполняйте эту строку с текстом-заглушкой. Здесь нет `--global`: меняются настройки только данного проекта. Подготовительные коммиты имеют технического автора `Project preparation`; они не выданы за собственные коммиты Руслана или владельца ноутбука.

## 4. Создать отдельный репозиторий GitHub

Войдите в аккаунт **enjo1si**. Откройте GitHub → New repository. Проверьте Owner: enjo1si. Название: `kr2-bootstrap-shop`. Видимость Public, чтобы преподаватель мог открыть работу. Не включайте Add README, .gitignore или license: они уже подготовлены. Нажмите Create repository.

Целевой адрес после создания: `https://github.com/enjo1si/kr2-bootstrap-shop`. Эта ссылка в инструкции — ожидаемый адрес, не подтверждение существования репозитория. Если GitHub сообщает, что имя занято, сначала проверьте уже существующий репозиторий.

В терминале проекта замените origin, который сейчас указывает на локальный bundle:

```sh
git remote set-url origin https://github.com/enjo1si/kr2-bootstrap-shop.git
git remote -v
```

Отправьте ветки, начиная с main:

```sh
git push -u origin main
git push -u origin feature/bootstrap-grid-page
git push -u origin feature/bootstrap-components
git push -u origin fix/kr2-final-check
```

`origin` — имя удалённого репозитория, `push` отправляет коммиты, `-u` запоминает связь веток. Если система запрашивает вход, используйте предложенную браузерную авторизацию или GitHub Desktop в аккаунте Руслана. Обычный пароль GitHub не заменяет токен для HTTPS Git. Не помещайте пароли/токены в код, README или чат. При ошибке остановитесь на этой команде и сохраните текст ошибки.

## 5. Практическая №9 — сетка и первый PR

Ветка `feature/bootstrap-grid-page` содержит главную страницу с hero, преимуществами и тремя популярными программами. Bootstrap подключён через CDN, custom.css после него. При просмотре этого этапа нужен интернет.

В GitHub откройте Pull requests → New pull request. Установите **base: main**, **compare: feature/bootstrap-grid-page**. Нажмите Create pull request. Название: `Create Bootstrap grid homepage`.

Описание:

```text
Создана главная страница «Форсаж»: hero, преимущества и популярные программы на Bootstrap-сетке. Bootstrap подключён через CDN, добавлен custom.css и README.
Как проверить: открыть index.html, проверить сетку на 375, 768, 1024 и 1440 px.
```

Просмотрите Files changed. Затем Conversation → Merge pull request → Confirm merge. Используйте **Create a merge commit**, не squash/rebase: следующие подготовленные ветки наследуют предыдущие коммиты. Сохраните ветку для показа преподавателю.

Чтобы отдельно посмотреть старый этап на компьютере, не переключая финальный проект:

```sh
git worktree add --detach ../forsazh-stage9 feature/bootstrap-grid-page
```

Откройте `../forsazh-stage9/index.html`. Не путайте её с итоговой версией.

Что понимать: `container` ограничивает ширину, `container-fluid` создаёт широкую область, `row` содержит колонки. `col-12` — вся строка, `col-md-6` — половина с 768 px, `col-lg-4` — треть с 992 px. Сетка состоит из 12 частей. `g-4` задаёт промежутки, `my-5` — вертикальные отступы.

## 6. Практическая №10 — компоненты и второй PR

После объединения первого PR создайте второй: **feature/bootstrap-components → main**. Название: `Add Bootstrap components pages`.

Описание:

```text
Добавлены единая навигация, каталог, описание программы и форма бронирования.
Использованы navbar, card, btn, badge, alert, modal, form-control, form-select, input-group, form-check и accordion.
Добавлены фильтры возраста/опыта, перенос программы в форму, калькулятор стоимости, страницы трасс и центра. Bootstrap подключён локально.
Проверка: каталог → детская секция → окно выбора → бронирование. Проверить обязательные поля и стоимость на нескольких участников. Открыть FAQ на странице программы.
```

Проверьте Files changed, затем Merge pull request → Confirm merge. Не удаляйте ветку до защиты.

Назначение кода:

- `navbar` — адаптивная шапка. `data-bs-target="#mainNav"` связывает кнопку с `id="mainNav"`.
- `card` — карточка программы; `h-100` и flex делают высоту и положение цены аккуратными.
- `btn` — кнопка, `btn-dark`/`btn-outline-dark` — варианты; `badge` — короткая метка возраста.
- `alert` с `role="alert"` — пояснение. `modal` — окно выбора, его target должен совпадать с id.
- `form-control`/`form-select` оформляют поля; `input-group` добавляет +7; `form-check` оформляет согласие. `label for` совпадает с id поля.
- `accordion` — раскрывающиеся вопросы. Меню, окно и FAQ требуют Bootstrap JS Bundle.
- `table-responsive` удерживает таблицу внутри доступной ширины.
- `programs` в app.js — данные четырёх программ. URLSearchParams читает `?program=kids` и сохраняет выбор между страницами.
- Фильтр сочетает возраст и опыт через логическое И. При нуле результатов выводится пояснение.
- `sync()` пересчитывает стоимость и варианты времени. Цена = стоимость программы × число участников.
- `preventDefault()` останавливает обычную отправку. `checkValidity()` проверяет ограничения, `was-validated` включает сообщения Bootstrap. `textContent` безопасно выводит результат как текст.

## 7. Практическая №11 — финальный PR и доработки

Создайте третий PR: **fix/kr2-final-check → main**, название `Prepare Bootstrap project for submission`.

Описание:

```text
Подготовлены читаемый HTML, инструкция macOS/VS Code, таблица требований, чек-лист и отчёт проверки. Итоговая версия использует локальный Bootstrap, дополнительные страницы, фильтры и улучшенную форму.
Проверка: все страницы на 375/768/1024/1440 px; меню, modal, accordion; перенос программы, цена на 1–4 участников, возраст и опыт, ограничения даты, сброс формы.
Реальные выполненные проверки перечислены в docs/VERIFICATION.md. Форма учебная, без отправки и оплаты.
```

Объедините PR через merge commit. Теперь финальный сайт находится в main. Обновите локальную копию:

```sh
git fetch origin
git switch main
git pull --ff-only
git status
git log --graph --oneline --all --decorate -12
```

Ожидается актуальная main и чистая рабочая папка. Во вкладке Pull requests → Closed должны быть три объединённых PR. Сам файл bundle не является Pull Request.

В №11 базовый вариант оценивается не более чем в 2,5 из 5; расширения перечислены в README. Их нужно уметь объяснить и проверить. Подготовленный код сам по себе не гарантирует оценку и не заменяет понимание.

## 8. Проверить самостоятельно и сделать собственный коммит

Откройте docs/CHECKLIST.md и отмечайте только лично выполненные пункты: `[ ]` → `[x]`. В Safari: Settings → Advanced → Show features for web developers → Develop → Enter Responsive Design Mode. Проверьте 375, 768, 1024, 1440 px, мобильное меню, карточки, форму и таблицы. В Chrome DevTools: ⌥⌘I, режим устройств ⇧⌘M.

Для своего коммита после обновления main:

```sh
git switch -c docs/my-browser-check
```

Измените чек-лист, сохраните ⌘S, затем:

```sh
git diff
git add docs/CHECKLIST.md
git commit -m "docs: record browser checks"
git push -u origin docs/my-browser-check
```

Создайте и объедините PR `docs/my-browser-check → main`. `git add` подготавливает изменения, `commit` сохраняет историю, `push` отправляет на GitHub. Простое ⌘S не отправляет код на GitHub.

## 9. Сдача и необязательная публикация

В СДО передайте ссылку на фактически созданный репозиторий `enjo1si/kr2-bootstrap-shop`. Проверьте, что исходники и README видны без входа. Покажите преподавателю компоненты, свои доработки, историю и PR.

GitHub Pages необязателен. Для публикации после всех PR: Settings → Pages → Deploy from a branch → main → /(root) → Save. Дождитесь реальной ссылки, проверьте страницы и добавьте её в README отдельным PR. Форма и на опубликованном сайте остаётся учебной.

КР №3 в конце документа №11 — отдельный проект на основе КР №1; она здесь не выполняется.
