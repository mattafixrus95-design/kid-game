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
    { id: "counting",    emoji: "🧮", label: "Счёт",              desc: "Скоро",                 locked: true },
    { id: "more_less",   emoji: "⚖️", label: "Больше / меньше",   desc: "Скоро",                 locked: true },
    { id: "numbers",     emoji: "🔢", label: "Цифры",             desc: "Учим цифры",            mechLevel: 2 },
  ],
};

// mechanic id → game level (только для разблокированных механик)
// mechanic id → game level
export const MECH_LEVEL = {
  words: 1, recognition: 2, attributes: 3, categories: 4, numbers: 2, who_missing: 5, memori: 6, sequence: 7, odd_one: 8, sort_groups: 9, continue: 10, spot_diff: 11, find_fast: 12, quantity: 13,
};
