// Логопедия: звуки, слоги и слова для тренировки произношения
// Каждый звук: буква, эталонное произношение для TTS, слоги и слова с этим звуком

const VOWELS = ["А", "О", "У", "Ы", "И"];

function syllables(letter) {
  const direct  = VOWELS.map(v => letter + v);   // РА РО РУ РЫ РИ
  const reverse = ["А", "О", "У"].map(v => v + letter); // АР ОР УР
  return [...direct, ...reverse];
}

export const SPEECH_SOUNDS = {
  "Р": {
    letter: "Р", pronounce: "р",
    syllables: syllables("Р"),
    words: [
      { name: "Рыба",    emoji: "🐟" },
      { name: "Ракета",  emoji: "🚀" },
      { name: "Радуга",  emoji: "🌈" },
      { name: "Роза",    emoji: "🌹" },
      { name: "Корова",  emoji: "🐮" },
      { name: "Морковь", emoji: "🥕" },
      { name: "Пирог",   emoji: "🥧" },
      { name: "Тигр",    emoji: "🐯" },
      { name: "Помидор", emoji: "🍅" },
      { name: "Топор",   emoji: "🪓" },
    ],
  },
  "Л": {
    letter: "Л", pronounce: "л",
    syllables: syllables("Л"),
    words: [
      { name: "Лампа",   emoji: "💡" },
      { name: "Луна",    emoji: "🌙" },
      { name: "Лук",     emoji: "🧅" },
      { name: "Лодка",   emoji: "🛶" },
      { name: "Молоко",  emoji: "🥛" },
      { name: "Пила",    emoji: "🪚" },
      { name: "Волк",    emoji: "🐺" },
      { name: "Стул",    emoji: "🪑" },
      { name: "Футбол",  emoji: "⚽" },
      { name: "Дятел",   emoji: "🐦" },
    ],
  },
  "Ш": {
    letter: "Ш", pronounce: "ш",
    syllables: ["ША", "ШО", "ШУ", "ШИ", "АШ", "ОШ", "УШ"],
    words: [
      { name: "Шар",      emoji: "🎈" },
      { name: "Шапка",    emoji: "🧢" },
      { name: "Шишка",    emoji: "🌰" },
      { name: "Машина",   emoji: "🚗" },
      { name: "Мышь",     emoji: "🐭" },
      { name: "Кошка",    emoji: "🐱" },
      { name: "Мишка",    emoji: "🧸" },
      { name: "Душ",      emoji: "🚿" },
      { name: "Карандаш", emoji: "✏️" },
      { name: "Лягушка",  emoji: "🐸" },
    ],
  },
  "Ж": {
    letter: "Ж", pronounce: "ж",
    syllables: ["ЖА", "ЖО", "ЖУ", "ЖИ", "АЖ", "ОЖ", "УЖ"],
    words: [
      { name: "Жук",      emoji: "🪲" },
      { name: "Жираф",    emoji: "🦒" },
      { name: "Жаба",     emoji: "🐸" },
      { name: "Жёлудь",   emoji: "🌰" },
      { name: "Лыжи",     emoji: "🎿" },
      { name: "Ёжик",     emoji: "🦔" },
      { name: "Медвежонок", emoji: "🐻" },
      { name: "Снежинка", emoji: "❄️" },
      { name: "Пижама",   emoji: "🩳" },
      { name: "Ножницы",  emoji: "✂️" },
    ],
  },
  "С": {
    letter: "С", pronounce: "с",
    syllables: syllables("С"),
    words: [
      { name: "Собака",  emoji: "🐶" },
      { name: "Сыр",     emoji: "🧀" },
      { name: "Солнце",  emoji: "☀️" },
      { name: "Самолёт", emoji: "✈️" },
      { name: "Сумка",   emoji: "👜" },
      { name: "Оса",     emoji: "🐝" },
      { name: "Автобус", emoji: "🚌" },
      { name: "Ананас",  emoji: "🍍" },
      { name: "Нос",     emoji: "👃" },
      { name: "Насос",   emoji: "⛽" },
    ],
  },
  "З": {
    letter: "З", pronounce: "з",
    syllables: syllables("З"),
    words: [
      { name: "Заяц",   emoji: "🐰" },
      { name: "Зонт",   emoji: "☂️" },
      { name: "Зебра",  emoji: "🦓" },
      { name: "Замок",  emoji: "🏰" },
      { name: "Звезда", emoji: "⭐" },
      { name: "Зуб",    emoji: "🦷" },
      { name: "Коза",   emoji: "🐐" },
      { name: "Арбуз",  emoji: "🍉" },
      { name: "Ваза",   emoji: "🏺" },
      { name: "Глаза",  emoji: "👀" },
    ],
  },
  "Ц": {
    letter: "Ц", pronounce: "ц",
    syllables: ["ЦА", "ЦО", "ЦУ", "ЦЫ", "АЦ", "ОЦ", "УЦ"],
    words: [
      { name: "Цыплёнок", emoji: "🐤" },
      { name: "Цветок",   emoji: "🌸" },
      { name: "Цирк",     emoji: "🎪" },
      { name: "Курица",   emoji: "🐔" },
      { name: "Пицца",    emoji: "🍕" },
      { name: "Птица",    emoji: "🐦" },
      { name: "Огурец",   emoji: "🥒" },
      { name: "Заяц",     emoji: "🐰" },
      { name: "Кольцо",   emoji: "💍" },
      { name: "Солнце",   emoji: "☀️" },
    ],
  },
  "Ч": {
    letter: "Ч", pronounce: "ч",
    syllables: ["ЧА", "ЧО", "ЧУ", "ЧИ", "АЧ", "ОЧ", "УЧ"],
    words: [
      { name: "Чайник",   emoji: "🫖" },
      { name: "Часы",     emoji: "⌚" },
      { name: "Черепаха", emoji: "🐢" },
      { name: "Чемодан",  emoji: "🧳" },
      { name: "Мяч",      emoji: "⚽" },
      { name: "Бабочка",  emoji: "🦋" },
      { name: "Очки",     emoji: "👓" },
      { name: "Ключ",     emoji: "🔑" },
      { name: "Врач",     emoji: "🧑‍⚕️" },
      { name: "Печенье",  emoji: "🍪" },
    ],
  },
  "Щ": {
    letter: "Щ", pronounce: "щ",
    syllables: ["ЩА", "ЩО", "ЩУ", "ЩИ", "АЩ", "ОЩ", "УЩ"],
    words: [
      { name: "Щука",   emoji: "🐟" },
      { name: "Щенок",  emoji: "🐶" },
      { name: "Щётка",  emoji: "🪥" },
      { name: "Щит",    emoji: "🛡️" },
      { name: "Ящик",   emoji: "📦" },
      { name: "Овощи",  emoji: "🥦" },
      { name: "Плащ",   emoji: "🧥" },
      { name: "Роща",   emoji: "🌳" },
      { name: "Ящерица", emoji: "🦎" },
      { name: "Клещи",  emoji: "🦀" },
    ],
  },
};

export const SOUND_IDS = Object.keys(SPEECH_SOUNDS);
