# Развивашки — правила разработки

Детское обучающее PWA-приложение на React + Vite. Целевая аудитория: дети 2–5 лет + родитель с телефоном. Интерфейс должен быть крупным, простым и работать без интернета.

## Текущая версия

`src/version.js` — `APP_VERSION = "3.24"`  
При каждом релизе обновлять это значение и указывать номер версии в PR.

Версия увеличивается на 0.1 за каждый релиз: 3.0 → 3.1 → 3.2 → ...  
После 3.9 идёт 3.10 (не 4.0) — версия не семантическая.

**Что такое релиз:** каждый коммит в master = релиз = +0.1 к версии. Без исключений для "мелких" правок. Обновлять `src/version.js` с каждым коммитом в master.

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

Определено в `src/lib/skills.js` → `MECHANICS{}` и `MECH_SCREEN{}`.

**Mechanic → screen:** `MECH_SCREEN` в `src/lib/skills.js` — маппинг mechanic id → screen id (строка). App.jsx переключается по screen id. `recognition`, `attributes`, `numbers` → `"quiz"` (GameQuizScreen); остальные — уникальные экраны.

### Контент (Content)

| id | Emoji | Название | Тип | Поддерживаемые механики |
|---|---|---|---|---|
| `animals` | 🐶 | Животные | emoji + аудио (`src/assets/sounds/*.wav`) | words, recognition, categories, who_missing, memori, sequence, odd_one, sort_groups, continue, spot_diff, find_fast, quantity, counting, more_less |
| `vehicles` | 🚗 | Транспорт | SVG (`VehicleSVG.jsx`, пропс `color` для attributes) | words, recognition, attributes, memori, sequence, odd_one |
| `food` | 🍎 | Еда | emoji (фрукты + овощи объединены) | words, recognition, categories, who_missing, memori, sequence, odd_one, sort_groups, continue, spot_diff, find_fast, quantity, counting, more_less |
| `colors` | 🎨 | Цвета | CSS background (заливка кругом) | words, recognition |
| `shapes` | 🔷 | Фигуры | SVG (`ShapeSVG.jsx`) | words, recognition, memori |
| `numbers` | 🔢 | Цифры | текст | numbers, continue |

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
| Еда | `fruits_exotic` | 🥭 Фрукты экзотические | 10 | Манго, Кокос, Авокадо, Папайя, Помело, Лайм, Маракуйя, Личи, Инжир, Кумкват |
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

Сборка: `npm run build` → Vite + vite-plugin-pwa.  
Обновление: кнопка «О приложении» в ServiceBar → «Проверить обновление» → активирует новый SW и перезагружает.

## Ветки и деплой

- Основная ветка: `master` (деплой автоматический через CI)
- Фича-ветки: `claude/<описание>`
- Коммиты: на русском, формат `v3.X: краткое описание`
- PR создавать с явным указанием версии в описании
