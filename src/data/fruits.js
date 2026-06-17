import { speak } from "../lib/audio";

const FRUITS_SIMPLE = [
  { name: "Яблоко",   emoji: "🍎" },
  { name: "Банан",    emoji: "🍌" },
  { name: "Груша",    emoji: "🍐" },
  { name: "Апельсин", emoji: "🍊" },
  { name: "Мандарин", emoji: "🍊" },
  { name: "Лимон",    emoji: "🍋" },
  { name: "Арбуз",    emoji: "🍉" },
  { name: "Дыня",     emoji: "🍈" },
  { name: "Виноград", emoji: "🍇" },
  { name: "Персик",   emoji: "🍑" },
  { name: "Слива",    emoji: "🍑" },   // ближайший к сливе — косточковый фрукт, как персик
  { name: "Абрикос",  emoji: "🍑" },
  { name: "Клубника", emoji: "🍓" },
  { name: "Малина",   emoji: "🍒" },   // красные ягоды; 🍒 отличает от клубники=🍓
  { name: "Вишня",    emoji: "🍒" },
];

const FRUITS_EXTRA = [
  { name: "Черешня",  emoji: "🍒" },
  { name: "Смородина",emoji: "🍇" },
  { name: "Крыжовник",emoji: "🍏" },
  { name: "Нектарин", emoji: "🍑" },
  { name: "Киви",     emoji: "🥝" },
  { name: "Ананас",   emoji: "🍍" },
  { name: "Гранат",   emoji: "🍎" },
  { name: "Хурма",    emoji: "🍊" },
  { name: "Голубика", emoji: "🔵" },   // синяя ягода; 🔵 — широко поддерживаемый синий кружок
  { name: "Ежевика",  emoji: "🫐" },
];

const FRUITS_EXOTIC = [
  { name: "Манго",    emoji: "🥭" },
  { name: "Кокос",    emoji: "🥥" },
  { name: "Авокадо",  emoji: "🥑" },
  { name: "Папайя",   emoji: "🍈" },
  { name: "Помело",   emoji: "🍋" },
  { name: "Лайм",     emoji: "🍋" },
  { name: "Маракуйя", emoji: "🍈" },   // экзотический круглый фрукт
  { name: "Личи",     emoji: "🍒" },
  { name: "Инжир",    emoji: "🍐" },   // грушевидная форма, как инжир; 🍐 широко поддерживается
  { name: "Кумкват",  emoji: "🍊" },
];

export const FRUIT_SETS = {
  simple: FRUITS_SIMPLE,
  extra:  FRUITS_EXTRA,
  exotic: FRUITS_EXOTIC,
};

export function playFruitSound(fruit) {
  speak(fruit.name);
}
