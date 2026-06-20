import { speak } from "../lib/audio";

const vegetableImages = import.meta.glob('/src/assets/vegetables/*.png', { eager: true });
function img(name) {
  return vegetableImages[`/src/assets/vegetables/${name}.png`]?.default;
}

const VEGETABLES_SIMPLE = [
  { name: "Картофель",      emoji: "🥔", image: img("Картофель") },
  { name: "Морковь",        emoji: "🥕", image: img("Морковь") },
  { name: "Огурец",         emoji: "🥒", image: img("Огурец") },
  { name: "Помидор",        emoji: "🍅", image: img("Помидор") },
  { name: "Лук",            emoji: "🧅", image: img("Лук") },
  { name: "Чеснок",         emoji: "🧄", image: img("Чеснок") },
  { name: "Капуста",        emoji: "🥬", image: img("Капуста") },
  { name: "Свёкла",         emoji: "🍠", image: img("Свёкла") },
  { name: "Перец сладкий",  emoji: "🌶️", image: img("Перец сладкий") },
  { name: "Кабачок",        emoji: "🥦", image: img("Кабачок") },
  { name: "Баклажан",       emoji: "🍆", image: img("Баклажан") },
  { name: "Редис",          emoji: "🌸", image: img("Редис") },
  { name: "Тыква",          emoji: "🎃", image: img("Тыква") },
  { name: "Зелёный горошек",emoji: "🌿", image: img("Зелёный горошек") },
  { name: "Укроп",          emoji: "🌱", image: img("Укроп") },
];

const VEGETABLES_EXTRA = [
  { name: "Цветная капуста",    emoji: "🌼", image: img("Цветная капуста") },
  { name: "Брокколи",           emoji: "🥦", image: img("Брокколи") },
  { name: "Шпинат",             emoji: "🍀", image: img("Шпинат") },
  { name: "Сельдерей",          emoji: "🌾", image: img("Сельдерей") },
  { name: "Пекинская капуста",  emoji: "🥬", image: img("Пекинская капуста") },
  { name: "Лук-порей",          emoji: "🧅", image: img("Лук-порей") },
  { name: "Фасоль стручковая",  emoji: "🥒", image: img("Фасоль стручковая") },
  { name: "Кукуруза",           emoji: "🌽", image: img("Кукуруза") },
  { name: "Пастернак",          emoji: "🥕", image: img("Пастернак") },
  { name: "Редька",             emoji: "🍠", image: img("Редька") },
];

const VEGETABLES_EXOTIC = [
  { name: "Артишок",   emoji: "🌺", image: img("Артишок") },
  { name: "Батат",     emoji: "🍠", image: img("Батат") },
  { name: "Топинамбур",emoji: "🌻", image: img("Топинамбур") },
  { name: "Патиссон",  emoji: "🥒", image: img("Патиссон") },
  { name: "Фенхель",   emoji: "🌿", image: img("Фенхель") },
  { name: "Дайкон",    emoji: "🥕", image: img("Дайкон") },
  { name: "Руккола",   emoji: "🌱", image: img("Руккола") },
  { name: "Мангольд",  emoji: "🥬", image: img("Мангольд") },
  { name: "Окра",      emoji: "🌶️", image: img("Окра") },
  { name: "Кольраби",  emoji: "🥦", image: img("Кольраби") },
];

export const VEGETABLE_SETS = {
  simple: VEGETABLES_SIMPLE,
  extra:  VEGETABLES_EXTRA,
  exotic: VEGETABLES_EXOTIC,
};

export function playVegetableSound(vegetable) {
  speak(vegetable.name);
}
