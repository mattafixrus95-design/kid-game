# Развивашки — правила разработки

Детское обучающее PWA-приложение на React + Vite. Целевая аудитория: дети 2–5 лет + родитель с телефоном. Интерфейс должен быть крупным, простым и работать без интернета.

## Текущая версия

`src/version.js` — `APP_VERSION = "3.13"`  
При каждом релизе обновлять это значение и указывать номер версии в PR.

Версия увеличивается на 0.1 за каждый релиз: 3.0 → 3.1 → 3.2 → ...  
После 3.9 идёт 3.10 (не 4.0) — версия не семантическая.

**Что такое релиз:** каждый смерженный PR в master = релиз = +0.1 к версии. Без исключений для "мелких" правок. Перед каждым PR обновлять `src/version.js`.

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

| Контент | id набора | Название | Кол-во |
|---|---|---|---|
| Животные | `domestic` | 🏠 Домашние | 7 |
| Животные | `wild` | 🌿 Дикие | 8 |
| Транспорт | `everyday` | 🚗 Транспорт | городские машины |
| Транспорт | `construction` | 🚜 Стройка | строительная техника |
| Транспорт | `special` | 🚒 Спецтехника | пожарная, скорая, полиция |
| Еда | `fruits_simple` | 🍎 Фрукты простые | 15 |
| Еда | `fruits_extra` | 🍍 Фрукты дополнительные | 10 |
| Еда | `fruits_exotic` | 🥭 Фрукты экзотические | 10 |
| Еда | `vegetables_simple` | 🥔 Овощи простые | 15 |
| Еда | `vegetables_extra` | 🌽 Овощи дополнительные | 10 |
| Еда | `vegetables_exotic` | 🌻 Овощи экзотические | 10 |
| Цвета | `basic` | Базовые | 4 |
| Цвета | `additional` | Дополнительные | 5 |
| Цвета | `shades` | Оттенки | 5 |
| Фигуры | `simple` | Простые | 4 |
| Фигуры | `composite` | Составные | 8 |
| Фигуры | `volumetric` | Объёмные | 4 |
| Цифры | `1-3` | 1 – 3 | 3 |
| Цифры | `1-5` | 1 – 5 | 5 |
| Цифры | `1-9` | 1 – 9 | 9 |

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
Обновление: кнопка «Обновить» в шестерёнке (⚙️) → перезагружает на экран навыков.

## Ветки и деплой

- Основная ветка: `master` (деплой автоматический через CI)
- Фича-ветки: `claude/<описание>`
- Коммиты: на русском, формат `v3.X: краткое описание`
- PR создавать с явным указанием версии в описании
