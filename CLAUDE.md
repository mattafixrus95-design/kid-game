# Развивашки — правила разработки

Детское обучающее PWA-приложение на React + Vite. Целевая аудитория: дети 2–5 лет + родитель с телефоном. Интерфейс должен быть крупным, простым и работать без интернета.

## Текущая версия

`src/version.js` — `APP_VERSION = "3.6"`  
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

| id | Навык | Emoji | Название | Статус | Уровень игры |
|---|---|---|---|---|---|
| `words` | speech | 📖 | Слова | ✅ активна | 1 (GameLearnScreen) |
| `recognition` | speech | 🎯 | Узнавание | ✅ активна | 2 (GameQuizScreen) |
| `attributes` | speech | 🔗 | Признаки | ✅ активна | 3 (GameQuizScreen) |
| `categories` | speech | 📦 | Категории | ✅ активна | 4 (GameCategoriesScreen) |
| `who_missing` | memory | ❓ | Кто пропал | ✅ активна | 5 (GameWhoMissingScreen) |
| `memori` | memory | 🃏 | Мемори | ✅ активна | 6 (GameMemoScreen) |
| `sequence` | memory | ➡️ | Последовательность | ✅ активна | 7 (GameSequenceScreen) |
| `odd_one` | logic | 🔎 | Найди лишнее | ✅ активна | 8 (GameOddOneScreen) |
| `sort_groups` | logic | 📂 | Разложи по группам | ✅ активна | 9 (GameStreamSortScreen) |
| `find_pair` | logic | 🔗 | Найди пару | 🔒 Скоро | — |
| `continue` | logic | 🔄 | Продолжи ряд | 🔒 Скоро | — |
| `spot_diff` | attention | 👀 | Найди отличие | 🔒 Скоро | — |
| `find_fast` | attention | ⚡ | Найди быстро | 🔒 Скоро | — |
| `quantity` | math | 🔢 | Количество | 🔒 Скоро | — |
| `counting` | math | 🧮 | Счёт | 🔒 Скоро | — |
| `more_less` | math | ⚖️ | Больше / меньше | 🔒 Скоро | — |
| `numbers` | math | 🔢 | Цифры | ✅ активна | 2 (GameQuizScreen) |

Определено в `src/lib/skills.js` → `MECHANICS{}` и `MECH_LEVEL{}`.

**Mechanic → game level:** `MECH_LEVEL` в `src/lib/skills.js`. Уровень 1 → `GameLearnScreen`, 2/3 → `GameQuizScreen`, 4 → `GameCategoriesScreen`, 5 → `GameWhoMissingScreen`, 6 → `GameMemoScreen`, 7 → `GameSequenceScreen`, 8 → `GameOddOneScreen`, 9 → `GameStreamSortScreen`.

### Контент (Content)

| id | Emoji | Название | Тип | Механики | Примечание |
|---|---|---|---|---|---|
| `animals` | 🐶 | Животные | emoji + аудио | words, recognition | `src/assets/sounds/*.wav` |
| `vehicles` | 🚗 | Транспорт | SVG | words, recognition, attributes | `VehicleSVG.jsx`, пропс `color` для attributes |
| `food` | 🍎 | Еда | emoji | words, recognition | Фрукты + Овощи объединены |
| `colors` | 🎨 | Цвета | CSS background | words, recognition | заливка кругом |
| `shapes` | 🔷 | Фигуры | SVG | words, recognition | `ShapeSVG.jsx` |
| `numbers` | 🔢 | Цифры | текст | numbers | только механика Цифры |

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

1. Добавить в `MECHANICS[skillId]` в `src/lib/skills.js` (убрать `locked: true`)
2. Добавить `mechLevel` (1, 2 или 3)
3. Добавить в `MECH_LEVEL` в `src/lib/skills.js`
4. Добавить mechanic id в `supportsMechanics` всех подходящих контент-записей в `registry.jsx`
5. Если нужна новая игровая логика — создать новый GameScreen (не трогать существующие)

## Игровые экраны

- `GameLearnScreen` — уровень 1: листать предметы, тап = озвучка
- `GameQuizScreen` — уровень 2/3: 4 варианта, угадать по имени

**Нельзя менять** `GameLearnScreen` и `GameQuizScreen` — это стабильное ядро.

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
