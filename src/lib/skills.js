// Единый источник правды для навыков и механик

export const SKILLS = [
  { id: "speech",    emoji: "🗣", label: "Речь",       color: "#4ECDC4" },
  { id: "memory",    emoji: "🧠", label: "Память",     color: "#FF8F00" },
  { id: "logic",     emoji: "🧩", label: "Логика",     color: "#8E24AA" },
  { id: "attention", emoji: "🔍", label: "Внимание",   color: "#FF6B35" },
  { id: "math",      emoji: "🔢", label: "Математика", color: "#00ACC1" },
];

export const MECHANICS = {
  speech: [
    { id: "words",       emoji: "📖", label: "Слова",             desc: "Учим названия",        mechLevel: 1 },
    { id: "recognition", emoji: "🎯", label: "Узнавание",         desc: "Выбери правильное",     mechLevel: 2 },
    { id: "attributes",  emoji: "🔗", label: "Признаки",          desc: "Цвет и предмет",        mechLevel: 3 },
    { id: "categories",  emoji: "📦", label: "Категории",         desc: "Найди нужные предметы",  mechLevel: 4 },
  ],
  memory: [
    { id: "who_missing", emoji: "❓", label: "Кто пропал",        desc: "Запомни и найди",       mechLevel: 5 },
    { id: "memori",      emoji: "🃏", label: "Мемори",            desc: "Найди пары",            mechLevel: 6 },
    { id: "sequence",    emoji: "➡️", label: "Последовательность",desc: "Повтори порядок",       mechLevel: 7 },
  ],
  logic: [
    { id: "odd_one",     emoji: "🔎", label: "Найди лишнее",      desc: "Что не подходит?",      mechLevel: 8 },
    { id: "sort_groups", emoji: "📂", label: "Разложи по группам",desc: "Сортируй объекты",       mechLevel: 9 },
    { id: "continue",    emoji: "🔄", label: "Продолжи ряд",      desc: "Что дальше?",           mechLevel: 10 },
  ],
  attention: [
    { id: "spot_diff",   emoji: "👀", label: "Найди отличие",     desc: "Что изменилось?",       mechLevel: 11 },
    { id: "find_fast",   emoji: "⚡", label: "Найди быстро",      desc: "Быстрее!",              mechLevel: 12 },
  ],
  math: [
    { id: "quantity",    emoji: "🔢", label: "Количество",        desc: "Сколько предметов?",    mechLevel: 13 },
    { id: "counting",    emoji: "🧮", label: "Счёт",              desc: "Считай по порядку",     mechLevel: 14 },
    { id: "more_less",   emoji: "⚖️", label: "Больше / меньше",   desc: "Сравни группы",         mechLevel: 15 },
    { id: "numbers",     emoji: "🔢", label: "Цифры",             desc: "Учим цифры",            mechLevel: 2 },
  ],
};

// mechanic id → game screen id
export const MECH_SCREEN = {
  words:       "learn",
  recognition: "quiz",
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
