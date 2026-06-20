import { speak } from "../lib/audio";

const fruitImages = import.meta.glob('/src/assets/fruits/*.png', { eager: true });
function img(name) {
  return fruitImages[`/src/assets/fruits/${name}.png`]?.default;
}

const FRUITS_SIMPLE = [
  { name: "Яблоко",   emoji: "🍎", image: img("Яблоко") },
  { name: "Банан",    emoji: "🍌", image: img("Банан") },
  { name: "Груша",    emoji: "🍐", image: img("Груша") },
  { name: "Апельсин", emoji: "🍊", image: img("Апельсин") },
  { name: "Мандарин", emoji: "🍊", image: img("Мандарин") },
  { name: "Лимон",    emoji: "🍋", image: img("Лимон") },
  { name: "Арбуз",    emoji: "🍉", image: img("Арбуз") },
  { name: "Дыня",     emoji: "🍈", image: img("Дыня") },
  { name: "Виноград", emoji: "🍇", image: img("Виноград") },
  { name: "Персик",   emoji: "🍑", image: img("Персик") },
  { name: "Слива",    emoji: "🍑", image: img("Слива") },
  { name: "Абрикос",  emoji: "🍑", image: img("Абрикос") },
  { name: "Клубника", emoji: "🍓", image: img("Клубника") },
  { name: "Малина",   emoji: "🍒", image: img("Малина") },
  { name: "Вишня",    emoji: "🍒", image: img("Вишня") },
];

const FRUITS_EXTRA = [
  { name: "Черешня",  emoji: "🍒", image: img("Черешня") },
  { name: "Смородина",emoji: "🍇", image: img("Смородина") },
  { name: "Крыжовник",emoji: "🍏", image: img("Крыжовник") },
  { name: "Нектарин", emoji: "🍑", image: img("Нектарин") },
  { name: "Киви",     emoji: "🥝", image: img("Киви") },
  { name: "Ананас",   emoji: "🍍", image: img("Ананас") },
  { name: "Гранат",   emoji: "🍎", image: img("Гранат") },
  { name: "Хурма",    emoji: "🍊", image: img("Хурма") },
  { name: "Голубика", emoji: "🔵", image: img("Голубика") },
  { name: "Ежевика",  emoji: "🫐", image: img("Ежевика") },
];

const FRUITS_EXOTIC = [
  { name: "Манго",    emoji: "🥭", image: img("Манго") },
  { name: "Кокос",    emoji: "🥥", image: img("Кокос") },
  { name: "Авокадо",  emoji: "🥑", image: img("Авокадо") },
  { name: "Папайя",   emoji: "🍈", image: img("Папайя") },
  { name: "Лайм",     emoji: "🍋", image: img("Лайм") },
  { name: "Маракуйя", emoji: "🍈", image: img("Маракуйя") },
  { name: "Личи",     emoji: "🍒", image: img("Личи") },
  { name: "Инжир",    emoji: "🍐", image: img("Инжир") },
  { name: "Кумкват",  emoji: "🍊", image: img("Кумкват") },
];

export const FRUIT_SETS = {
  simple: FRUITS_SIMPLE,
  extra:  FRUITS_EXTRA,
  exotic: FRUITS_EXOTIC,
};

export function playFruitSound(fruit) {
  speak(fruit.name);
}
