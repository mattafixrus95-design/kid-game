# Развивашки — правила разработки

Детское обучающее PWA-приложение на React + Vite. Целевая аудитория: дети 2–5 лет + родитель с телефоном. Интерфейс должен быть крупным, простым и работать без интернета.

## Текущая версия

`src/version.js` — `APP_VERSION = "1.0.0"`

**Схема версионирования сменилась с публикацией в RuStore (после APP_VERSION 3.75).**
До этого версия росла на +0.1 с каждым коммитом в master (нессемантическая: 3.0 → 3.1 → ... → 3.9 → 3.10).
Начиная с релиза в сторы используется семантическая нумерация (`MAJOR.MINOR.PATCH`),
синхронизированная с версией APK-пакета (`appVersionName`/`appVersionCode` в
`android/twa-manifest.json`) — версия обновляется **только при релизе в RuStore**,
а не при каждом пуше в master. Веб/PWA-версия продолжает обновляться в фоне
через service worker при каждом деплое независимо от номера в `APP_VERSION`
(см. `android/README.md` про синхронизацию версий пакета и приложения).

## Навигация

```
Skills → Mechanics → Content → Subsets → Game
```

Состояние в `App.jsx`: `screen`, `skill`, `mechanic`, `rubric`, `settingsByRubric`, `records`.

## Структура приложения

### Главное меню (Skills)

| id | Emoji | Название |
|---|---|---|
| `speech` | 🗣 | Речь |
| `memory` | 🧠 | Память |
| `logic` | 🧩 | Логика |
| `attention` | 🔍 | Внимание |
| `math` | 🔢 | Математика |

Определено в `src/lib/skills.js` → `SKILLS[]`.

### Механики (Mechanics)

| id | Навык | Emoji | Название | Статус | Экран |
|---|---|---|---|---|---|
| `words` | speech | 📖 | Слова | ✅ активна | `learn` → GameLearnScreen |
| `recognition` | speech | 🎯 | Узнавание | ✅ активна | `quiz` → GameQuizScreen |
| `attributes` | speech | 🔗 | Признаки | ✅ активна | `quiz` → GameQuizScreen |
| `categories` | speech | 📦 | Категории | ✅ активна | `categories` → GameCategoriesScreen |
| `who_missing` | memory | ❓ | Кто пропал | ✅ активна | `who_missing` → GameWhoMissingScreen |
| `memori` | memory | 🃏 | Мемори | ✅ активна | `memo` → GameMemoScreen |
| `sequence` | memory | ➡️ | Последовательность | ✅ активна | `sequence` → GameSequenceScreen |
| `odd_one` | logic | 🔎 | Найди лишнее | ✅ активна | `odd_one` → GameOddOneScreen |
| `sort_groups` | logic | 📂 | Разложи по группам | ✅ активна | `sort` → GameStreamSortScreen |
| `continue` | logic | 🔄 | Продолжи ряд | ✅ активна | `continue` → GameContinueScreen |
| `spot_diff` | attention | 👀 | Найди отличие | ✅ активна | `spot_diff` → GameSpotDiffScreen |
| `find_fast` | attention | ⚡ | Найди быстро | ✅ активна | `fast_find` → GameFastFindScreen |
| `quantity` | math | 🔢 | Количество | ✅ активна | `quantity` → GameQuantityScreen |
| `counting` | math | 🧮 | Счёт | ✅ активна | `counting` → GameCountingScreen |
| `more_less` | math | ⚖️ | Больше / меньше | ✅ активна | `compare` → GameCompareScreen |
| `numbers` | math | 🔢 | Цифры | ✅ активна | `quiz` → GameQuizScreen |
| `letters` | speech | 🔤 | Звуки | ✅ активна | `letters` → GameLettersScreen |
| `repeat_word` | speech | 🗣 | Повтори слово | ✅ активна | `repeat_word` → GameRepeatWordScreen |

`letters`/`repeat_word` — логопедические механики (звуки/слоги и слова со звуком в разных позициях), контент `sounds`, данные в `src/data/speech.js`. Общая настройка «Какой звук тренируем» (Р, Л, Ш, Ж, С, З, Ц, Ч, Щ), экран subsets пропускается (единственный контент под эти механики).

Определено в `src/lib/skills.js` → `MECHANICS{}` и `MECH_SCREEN{}`.

**Mechanic → screen:** `MECH_SCREEN` в `src/lib/skills.js` — маппинг mechanic id → screen id (строка). App.jsx переключается по screen id. `recognition`, `attributes`, `numbers` → `"quiz"` (GameQuizScreen); остальные — уникальные экраны.

### Контент (Content)

| id | Emoji | Название | Тип | Поддерживаемые механики |
|---|---|---|---|---|
| `animals` | 🐶 | Животные | PNG-картинки (`src/assets/animals/`) + аудио (`src/assets/sounds/*.wav`), эмодзи-фоллбэк | words, recognition, categories, who_missing, memori, sequence, odd_one, sort_groups, continue, spot_diff, find_fast, quantity, counting, more_less |
| `vehicles` | 🚗 | Транспорт | PNG-картинки (`src/assets/vehicles/`), SVG-фоллбэк (`VehicleSVG.jsx`, пропс `color` для attributes) | words, recognition, attributes, memori, sequence, odd_one, sort_groups |
| `food` | 🍎 | Еда | PNG-картинки (`src/assets/fruits/`, `src/assets/vegetables/`), эмодзи-фоллбэк | words, recognition, categories, who_missing, memori, sequence, odd_one, sort_groups, continue, spot_diff, find_fast, quantity, counting, more_less |
| `colors` | 🎨 | Цвета | CSS background (заливка кругом) | words, recognition |
| `shapes` | 🔷 | Фигуры | PNG-картинки (`src/assets/shapes/`), SVG-фоллбэк (`ShapeSVG.jsx`) | words, recognition, memori, categories, who_missing, sequence, odd_one, continue |
| `numbers` | 🔢 | Цифры | текст | numbers, continue |
| `sounds` | 🔤 | Звуки | текст (буква/слоги) + PNG-картинки в словах | letters, repeat_word |

Определено в `src/games/registry.jsx` → `REGISTRY{}` с полем `supportsMechanics: string[]`.

### Подконтент (Subsets)

| Контент | id набора | Название | Кол-во | Объекты |
|---|---|---|---|---|
| Животные | `domestic` | 🏠 Домашние | 8 | Кошка, Собака, Корова, Коза, Баран, Лошадь, Петух, Гусь |
| Животные | `wild` | 🌿 Дикие | 15 | Тигр, Лев, Медведь, Волк, Лиса, Заяц, Олень, Слон, Обезьяна, Лось, Ёж, Бегемот, Носорог, Жираф, Белка |
| Транспорт | `everyday` | 🚗 Городской | 5 | Легковая машина, Грузовик, Автобус, Такси, Мотоцикл |
| Транспорт | `construction` | 🚜 Стройка | 6 | Экскаватор, Бульдозер, Автокран, Каток, Трактор, Самосвал |
| Транспорт | `special` | 🚒 Спецтехника | 6 | Пожарная машина, Скорая помощь, Полицейская машина, Эвакуатор, Мусорная машина, Бензовоз |
| Еда | `fruits_simple` | 🍎 Фрукты простые | 15 | Яблоко, Банан, Груша, Апельсин, Мандарин, Лимон, Арбуз, Дыня, Виноград, Персик, Слива, Абрикос, Клубника, Малина, Вишня |
| Еда | `fruits_extra` | 🍍 Фрукты дополнительные | 10 | Черешня, Смородина, Крыжовник, Нектарин, Киви, Ананас, Гранат, Хурма, Голубика, Ежевика |
| Еда | `fruits_exotic` | 🥭 Фрукты экзотические | 9 | Манго, Кокос, Авокадо, Папайя, Лайм, Маракуйя, Личи, Инжир, Кумкват |
| Еда | `vegetables_simple` | 🥔 Овощи простые | 15 | Картофель, Морковь, Огурец, Помидор, Лук, Чеснок, Капуста, Свёкла, Перец сладкий, Кабачок, Баклажан, Редис, Тыква, Зелёный горошек, Укроп |
| Еда | `vegetables_extra` | 🌽 Овощи дополнительные | 10 | Цветная капуста, Брокколи, Шпинат, Сельдерей, Пекинская капуста, Лук-порей, Фасоль стручковая, Кукуруза, Пастернак, Редька |
| Еда | `vegetables_exotic` | 🌻 Овощи экзотические | 10 | Артишок, Батат, Топинамбур, Патиссон, Фенхель, Дайкон, Руккола, Мангольд, Окра, Кольраби |
| Цвета | `basic` | Базовые | 4 | Красный, Жёлтый, Зелёный, Синий |
| Цвета | `additional` | Дополнительные | 5 | Оранжевый, Фиолетовый, Розовый, Белый, Чёрный |
| Цвета | `shades` | Оттенки | 5 | Голубой, Салатовый, Коричневый, Серый, Бирюзовый |
| Фигуры | `simple` | Простые | 4 | Круг, Квадрат, Треугольник, Овал |
| Фигуры | `composite` | Составные | 8 | Прямоугольник, Ромб, Трапеция, Звезда, Полукруг, Сердце, Пятиугольник, Шестиугольник |
| Фигуры | `volumetric` | Объёмные | 4 | Куб, Шар, Конус, Цилиндр |
| Цифры | `1-3` | 1 – 3 | 3 | 1, 2, 3 |
| Цифры | `1-5` | 1 – 5 | 5 | 1, 2, 3, 4, 5 |
| Цифры | `1-9` | 1 – 9 | 9 | 1, 2, 3, 4, 5, 6, 7, 8, 9 |

## Как добавить новую категорию контента

1. Создать `src/data/<name>.js`:
   - Массивы items: `{ name: "Название", emoji: "🍎" }` (или `{ name, soundFile }` для аудио)
   - Объект `<NAME>_SETS = { simple, extra, ... }`
   - Функция `play<Name>Sound(item) { speak(item.name) }`

2. Добавить запись в `REGISTRY` в `src/games/registry.jsx`:
   - Обязательные поля: `emoji`, `title`, `recordKey`, `supportsMechanics`, `defaultSettings`, `getDataset`, `getSettingsSections`, `getKey`, `getName`, `renderLearn`, `renderOption`, `getOptionStyle`, `optionsContainerStyle`, `onSelect`
   - Цвет фона карточек: `cardOptionStyle(name, state, { background: "..." })`
   - Добавить цвет в `CONTENT_COLORS` в `ContentScreen.jsx`

3. Обновить версию в `src/version.js`.

## Как добавить новую механику

1. Добавить запись в `MECHANICS[skillId]` в `src/lib/skills.js` с полями `id`, `emoji`, `label`, `desc`, `mechLevel` (убрать `locked: true` если была заглушка)
2. Добавить `mechanic_id: "screen_id"` в `MECH_SCREEN` в `src/lib/skills.js`
3. Добавить mechanic id в `supportsMechanics` всех подходящих контент-записей в `registry.jsx`
4. Добавить обработку `gameScreen === "screen_id"` в `App.jsx`
5. Создать новый `GameXxxScreen.jsx` (не трогать существующие экраны)

## Игровые экраны

| Файл | Screen id | Механики |
|---|---|---|
| `GameLearnScreen` | `learn` | words |
| `GameQuizScreen` | `quiz` | recognition, attributes, numbers |
| `GameCategoriesScreen` | `categories` | categories |
| `GameWhoMissingScreen` | `who_missing` | who_missing |
| `GameMemoScreen` | `memo` | memori |
| `GameSequenceScreen` | `sequence` | sequence |
| `GameOddOneScreen` | `odd_one` | odd_one |
| `GameStreamSortScreen` | `sort` | sort_groups |
| `GameContinueScreen` | `continue` | continue |
| `GameSpotDiffScreen` | `spot_diff` | spot_diff |
| `GameFastFindScreen` | `fast_find` | find_fast |
| `GameQuantityScreen` | `quantity` | quantity |
| `GameCountingScreen` | `counting` | counting |
| `GameCompareScreen` | `compare` | more_less |
| `GameLettersScreen` | `letters` | letters |
| `GameRepeatWordScreen` | `repeat_word` | repeat_word |

**Нельзя менять** `GameLearnScreen` и `GameQuizScreen` — это стабильное ядро. Для новых механик всегда создавать новый экран.

## Настройки (Subsets)

- `multiSetSection()` → `settings.sets: string[]`, чекбоксы с `values`/`onToggle`
- Обычная radio-секция → `settings.range` / любой string, кнопки с `value`/`onChange`
- `defaultSettings` задаётся в `REGISTRY`

## Стили и константы

`src/lib/styles.js`:
- `LEARN_EMOJI_SIZE` — размер emoji на экране изучения
- `learnSvgSize(max)` — размер SVG
- `cardOptionStyle(key, state, overrides)` — стиль карточки варианта ответа
- `clamp(min, max)` — CSS clamp для отступов
- `checkboxDotStyle(active, color)` — кружок-чекбокс в настройках
- `GLOBAL_STYLES` — глобальные CSS переменные и классы

Шрифт: Nunito (Google Fonts, подключается в `App.jsx`).

## Аудио

- `src/lib/audio.js` → `speak(text)` (Web Speech API TTS)
- Животные: реальные звуки из `src/assets/sounds/`, фоллбэк на TTS
- Остальные категории: только TTS

## PWA / Service Worker

Сборка: `npm run build` → Vite + vite-plugin-pwa (`registerType: 'autoUpdate'`).
Обновление полностью фоновое — ручной кнопки «Проверить обновление» в интерфейсе
больше нет (убрана намеренно). Service worker сам проверяет новую версию при
каждом открытии приложения и активирует её через `skipWaiting`/`clientsClaim`.

`vite.config.js` → `workbox.globPatterns` включает `png,svg,webp,jpg,jpeg` —
все игровые картинки из `dist/assets` попадают в precache при установке SW,
чтобы механики не ждали сеть при первом открытии (реальные хэшированные URL,
без ручного списка).

## Аналитика — Яндекс Метрика

Счётчик подключён один раз в `index.html` (id `111721456`), в React-компонентах
`window.ym` напрямую не вызывается — только через `src/lib/analytics.js`:
`trackEvent`, `trackSkillOpen`, `trackMechanicStart`, `trackFeedbackClick`,
`trackDonateClick`, `trackAboutClick`. Каждое событие несёт параметр `platform`
(`web` / `pwa` по `display-mode: standalone` / `apk_webview` по
`window.APP_PLATFORM`, определяется централизованно внутри `analytics.js`).
`trackMechanicStart` вызывается только в App.jsx в местах реального перехода
к игре (не в render/useEffect игровых экранов — исключены дубли).

## Политика конфиденциальности

`src/screens/PrivacyPolicyScreen.jsx` — полный текст встроен в приложение,
работает офлайн, без iframe и без внешнего URL. Открывается из модалки
«О приложении» (`ServiceBar.jsx`) кнопкой «Политика конфиденциальности»,
рендерится как оверлей (не отдельный `screen` в App.jsx). Кнопка «Назад»
(и системная, и внутренняя) возвращает в «О приложении» — `ServiceBar` сам
слушает `popstate` для этого перехода, отдельно от общей hash-навигации.

## RuStore / Android (TWA)

Приложение публикуется в RuStore как TWA (Trusted Web Activity) — тонкая
нативная обёртка вокруг живого сайта, без нативного кода. Конфиг и инструкция
по сборке — `android/twa-manifest.json`, `android/README.md`. Package name
`ru.mattafixrus95.razvivashki` (менять нельзя после публикации). Digital Asset
Links — `public/.well-known/assetlinks.json` (деплоится вместе с сайтом).

Контентные обновления (весь обычный процесс работы в этом репозитории) не
требуют пересборки APK — TWA открывает актуальный сайт, обновления прилетают
через service worker всем сразу, включая пользователей RuStore. Пересборка
APK нужна только при изменении нативной обёртки (иконка, permissions, домен,
keystore) — это редкие релизы, не привязанные к `APP_VERSION`.

## Ветки и деплой

- Основная ветка: `master` — прод, деплой автоматический через Vercel при пуше
- Приложение уже опубликовано в RuStore (APK/TWA), реальные пользователи —
  ломать прод дороже, чем раньше

### Процесс релиза (лёгкий уровень строгости)

1. Изменения делать в фича-ветке `claude/<описание>`, не пушить напрямую в `master`
2. После пуша в ветку Vercel сам поднимает preview-деплой по уникальному URL
   (ничего дополнительно настраивать не нужно, это дефолт для GitHub-репо,
   подключённого к Vercel)
3. Перед мержем — самостоятельно проверить preview (сборка, смок-тест через
   Playwright: открывается, ключевые переходы работают, в консоли нет ошибок)
4. Смерджить ветку в `master` → задеплоится в прод
5. Ссылку на preview всегда присылать пользователю в ответе — он смотрит
   по желанию, релиз это не блокирует (не ждём подтверждения)
6. Если что-то всё же сломалось в проде — откатывать через `git revert
   <commit>` и пуш в `master`, не бояться отката

- Коммиты: на русском; до релиза в RuStore — формат `vX.Y: краткое описание`
  (нессемантическая версия), после — `X.Y.Z: краткое описание` (семантическая,
  синхронизирована с версией APK, см. «Текущая версия» выше)
