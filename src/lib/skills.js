// Единый источник правды для навыков и механик

export const SKILLS = [
  { id: "speech",    emoji: "🗣", label: "Речь",       desc: "Учимся понимать и называть предметы",  color: "#4ECDC4" },
  { id: "memory",    emoji: "🧠", label: "Память",     desc: "Запоминаем и вспоминаем",              color: "#FF8F00" },
  { id: "logic",     emoji: "🧩", label: "Логика",     desc: "Ищем закономерности и связи",          color: "#8E24AA" },
  { id: "attention", emoji: "🔍", label: "Внимание",   desc: "Замечаем детали и ищем быстрее",       color: "#FF6B35" },
  { id: "math",      emoji: "🔢", label: "Математика", desc: "Считаем и сравниваем",                 color: "#00ACC1" },
];

export const MECHANICS = {
  speech: [
    { id: "words",       emoji: "📖", label: "Слова",             desc: "Изучаем новые слова",                    mechLevel: 1 },
    { id: "recognition", emoji: "🎯", label: "Узнавание",         desc: "Находим предмет по названию",           mechLevel: 2 },
    { id: "letters",     emoji: "🔤", label: "Звуки",             desc: "Повторяем звуки и слоги",               mechLevel: 3 },
    { id: "repeat_word", emoji: "🗣", label: "Повтори слово",     desc: "Тренируем звук в словах",               mechLevel: 4 },
    { id: "attributes",  emoji: "🔗", label: "Признаки",          desc: "Учимся различать свойства",             mechLevel: 3, wip: true },
    { id: "categories",  emoji: "📦", label: "Категории",         desc: "Учимся объединять похожее",             mechLevel: 4, wip: true },
  ],
  memory: [
    { id: "who_missing", emoji: "❓", label: "Кто пропал",        desc: "Запоминаем и ищем пропажу",             mechLevel: 5 },
    { id: "memori",      emoji: "🃏", label: "Мемори",            desc: "Находим одинаковые карточки",           mechLevel: 6 },
    { id: "sequence",    emoji: "➡️", label: "Последовательность",desc: "Запоминаем порядок",                    mechLevel: 7 },
  ],
  logic: [
    { id: "odd_one",     emoji: "🔎", label: "Найди лишнее",      desc: "Ищем объект, который не подходит",      mechLevel: 8 },
    { id: "sort_groups", emoji: "📂", label: "Разложи по группам",desc: "Сортируем предметы по категориям",      mechLevel: 9 },
    { id: "continue",    emoji: "🔄", label: "Продолжи ряд",      desc: "Находим, что будет дальше",             mechLevel: 10 },
  ],
  attention: [
    { id: "spot_diff",   emoji: "👀", label: "Найди отличие",     desc: "Сравниваем картинки",                   mechLevel: 11 },
    { id: "find_fast",   emoji: "⚡", label: "Найди быстро",      desc: "Ищем предмет на скорость",              mechLevel: 12 },
  ],
  math: [
    { id: "quantity",    emoji: "🔢", label: "Количество",        desc: "Считаем сколько предметов",             mechLevel: 13 },
    { id: "counting",    emoji: "🧮", label: "Счёт",              desc: "Учимся считать по порядку",             mechLevel: 14 },
    { id: "more_less",   emoji: "⚖️", label: "Больше / меньше",   desc: "Сравниваем группы предметов",           mechLevel: 15 },
    { id: "numbers",     emoji: "🔢", label: "Цифры",             desc: "Изучаем цифры",                         mechLevel: 2 },
  ],
};

// mechanic id → game screen id
export const MECH_SCREEN = {
  words:       "learn",
  recognition: "quiz",
  letters:     "letters",
  repeat_word: "repeat_word",
  attributes:  "quiz",
  categories:  "categories",
  who_missing: "who_missing",
  memori:      "memo",
  sequence:    "sequence",
  odd_one:     "odd_one",
  sort_groups: "sort",
  continue:    "continue",
  spot_diff:   "spot_diff",
  find_fast:   "fast_find",
  quantity:    "quantity",
  counting:    "counting",
  more_less:   "compare",
  numbers:     "quiz",
};
