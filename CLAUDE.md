# Развивашки — правила разработки

Детское обучающее PWA-приложение на React + Vite. Целевая аудитория: дети 2–5 лет + родитель с телефоном. Интерфейс должен быть крупным, простым и работать без интернета.

## Текущая версия

`src/version.js` — `APP_VERSION = "1.7"`  
При каждом релизе обновлять это значение и указывать номер версии в PR.

## Архитектура

### Точки входа

| Файл | Роль |
|---|---|
| `src/App.jsx` | Роутер: menu → settings → game. Хранит `screen`, `rubric`, `settingsByRubric`, `records` |
| `src/games/registry.jsx` | **Единственный источник правды** для всех категорий |
| `src/components/MenuScreen.jsx` | Главное меню с **хардкодированным** массивом `RUBRICS` — обновлять вручную |

### Игровые экраны

- `GameLearnScreen` — Уровень 1 «Повторение»: показывает предмет, тап → TTS
- `GameQuizScreen` — Уровень 2 «Узнавание» + Уровень 3 «Сочетания»: 4 варианта, выбрать правильный

### Восстановление состояния после reload

`App.jsx` читает `sessionStorage.getItem("kg_restore")` при инициализации модуля (до рендера).  
`VersionButton` сохраняет туда `{ screen, rubric, settingsByRubric }` перед `window.location.reload()`.  
Это позволяет вернуться в настройки после нажатия «Обновить» в шестерёнке.

## Как добавить новую категорию

1. Создать `src/data/<name>.js` по образцу `fruits.js`:
   - Массивы items: `{ name: "Название", emoji: "🍎" }` (или `{ name, soundFile }` для животных с аудио)
   - Объект `<NAME>_SETS = { simple, extra, ... }`
   - Функция `play<Name>Sound(item) { speak(item.name) }`

2. Добавить запись в `REGISTRY` в `src/games/registry.jsx`:
   - Обязательные поля: `emoji`, `title`, `recordKey`, `defaultSettings`, `getDataset`, `getSettingsSections`, `getKey`, `getName`, `introTextLearn`, `titleLearn`, `renderLearn`, `introTextQuiz`, `titleQuiz`, `renderOption`, `getOptionStyle`, `optionsContainerStyle`, `onSelect`
   - Для многорежимных наборов использовать `multiSetSection()`
   - Цвет фона карточек задаётся в `getOptionStyle` через `cardOptionStyle(name, state, { background: "..." })`

3. Добавить в `RUBRICS` в `src/components/MenuScreen.jsx`:
   ```js
   { id: "<name>", emoji: "🥕", label: "Название", color: "#RRGGBB" }
   ```

4. Обновить версию в `src/version.js`.

## Типы визуальных ресурсов

| Категория | Тип | Примечание |
|---|---|---|
| Животные | emoji + аудиофайл | `src/assets/sounds/*.wav` |
| Машины | SVG-компонент | `VehicleSVG.jsx`, пропс `color` для уровня 3 |
| Фигуры | SVG-компонент | `ShapeSVG.jsx` |
| Цвета | CSS `background` | заливка кругом |
| Цифры | текст | CSS-рендер числа |
| Фрукты | emoji | TTS через `speak()` |
| Овощи | emoji | TTS через `speak()` |

## Настройки категорий

- Множественный выбор наборов: `multiSetSection()` → `settings.sets: string[]`
- Одиночный выбор (range, уровень): обычная radio-секция → `settings.range` / `settings.level`
- `defaultSettings` задаётся в `REGISTRY`, инициализируется в `App.jsx`

## Уровни обучения

- **Уровень 1** — `GameLearnScreen`: листать предметы, тап = озвучка
- **Уровень 2** — `GameQuizScreen`: 4 варианта, угадать по имени (TTS задаёт вопрос)
- **Уровень 3** — `GameQuizScreen` с комбо-items (сейчас только машины: цвет + машина)

Для уровня 3 нужно:
- `gender` у каждого item в данных (`"m"` / `"f"` / `"n"`)
- `forms: { m, f, n }` у прилагательных (цвета)
- Отдельная функция генерации комбо (см. `vehicleCombos()`)
- Отдельная секция уровней с опцией 3 (см. `vehicleLevelSection()`)

## Стили и константы

Все общие константы стилей — в `src/lib/styles.js`:
- `LEARN_EMOJI_SIZE` — размер emoji на экране изучения
- `learnSvgSize(max)` — размер SVG на экране изучения
- `cardOptionStyle(key, state, overrides)` — стиль карточки варианта ответа
- `clamp(min, max)` — CSS clamp для отступов
- `GLOBAL_STYLES` — глобальные CSS переменные и классы

Шрифт: Nunito (Google Fonts, подключается в `App.jsx`).

## Аудио

- `src/lib/audio.js` — экспортирует `speak(text)` (Web Speech API TTS)
- Животные: реальные звуки из `src/assets/sounds/`, фоллбэк на TTS
- Все остальные категории: только TTS

## PWA / Service Worker

Сборка: `npm run build` → Vite + vite-plugin-pwa генерирует SW автоматически.  
После деплоя пользователь видит новую версию через кнопку «Обновить» в шестерёнке (⚙️).  
SW регистрируется в `main.jsx`.

## Ветки и деплой

- Основная ветка: `master` (деплой автоматический через CI)
- Фича-ветки: `claude/<описание>`
- Коммиты: на русском, формат `v1.X: краткое описание`
- PR создавать с явным указанием версии в описании
