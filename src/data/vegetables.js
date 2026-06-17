import { speak } from "../lib/audio";

// Простые овощи — узнаваемые, часто встречаются в магазине/на кухне
const VEGETABLES_SIMPLE = [
  { name: "Картофель",      emoji: "🥔" },
  { name: "Морковь",        emoji: "🥕" },
  { name: "Огурец",         emoji: "🥒" },
  { name: "Помидор",        emoji: "🍅" },
  { name: "Лук",            emoji: "🧅" },
  { name: "Чеснок",         emoji: "🧄" },
  { name: "Капуста",        emoji: "🥬" },
  { name: "Свёкла",         emoji: "🍠" },
  { name: "Перец сладкий",  emoji: "🌶️" },
  { name: "Кабачок",        emoji: "🥦" },
  { name: "Баклажан",       emoji: "🍆" },
  { name: "Редис",          emoji: "🌸" },
  { name: "Тыква",          emoji: "🎃" },
  { name: "Зелёный горошек",emoji: "🌿" },
  { name: "Укроп",          emoji: "🌱" },
];

// Дополнительные овощи — менее распространённые, но знакомые
const VEGETABLES_EXTRA = [
  { name: "Цветная капуста",    emoji: "🌼" },
  { name: "Брокколи",           emoji: "🥦" },
  { name: "Шпинат",             emoji: "🍀" },
  { name: "Сельдерей",          emoji: "🌾" },
  { name: "Пекинская капуста",  emoji: "🥬" },
  { name: "Лук-порей",          emoji: "🧅" },
  { name: "Фасоль стручковая",  emoji: "🥒" },
  { name: "Кукуруза",           emoji: "🌽" },
  { name: "Пастернак",          emoji: "🥕" },
  { name: "Редька",             emoji: "🍠" },
];

// Экзотические / менее знакомые овощи
const VEGETABLES_EXOTIC = [
  { name: "Артишок",   emoji: "🌺" },
  { name: "Батат",     emoji: "🍠" },
  { name: "Топинамбур",emoji: "🌻" },
  { name: "Патиссон",  emoji: "🥒" },
  { name: "Фенхель",   emoji: "🌿" },
  { name: "Дайкон",    emoji: "🥕" },
  { name: "Руккола",   emoji: "🌱" },
  { name: "Мангольд",  emoji: "🥬" },
  { name: "Окра",      emoji: "🌶️" },
  { name: "Кольраби",  emoji: "🥦" },
];

export const VEGETABLE_SETS = {
  simple: VEGETABLES_SIMPLE,
  extra:  VEGETABLES_EXTRA,
  exotic: VEGETABLES_EXOTIC,
};

export function playVegetableSound(vegetable) {
  speak(vegetable.name);
}
