import { speak, playSound } from "../lib/audio";

const animalImages = import.meta.glob('/src/assets/animals/*.png', { eager: true });
function img(name) {
  return animalImages[`/src/assets/animals/${name}.png`]?.default;
}

const ANIMALS_DOMESTIC = [
  { name: "Кошка",   emoji: "🐱", sound: "мяу",      file: "cat.wav",     image: img("Кошка") },
  { name: "Собака",  emoji: "🐶", sound: "гав",      file: "dog.wav",     image: img("Собака") },
  { name: "Корова",  emoji: "🐮", sound: "му",       file: "cow.wav",     image: img("Корова") },
  { name: "Коза",    emoji: "🐐", sound: "меее",     file: "goat.wav",    image: img("Коза") },
  { name: "Баран",   emoji: "🐑", sound: "беее",     file: "sheep.wav",   image: img("Баран") },
  { name: "Лошадь",  emoji: "🐴", sound: "и-го-го",  file: "horse.wav",   image: img("Лошадь") },
  { name: "Петух",   emoji: "🐓", sound: "кукареку", file: "rooster.wav", image: img("Петух") },
  { name: "Гусь",    emoji: "🦢", sound: "га-га",                         image: img("Гусь") },
];
const ANIMALS_WILD = [
  { name: "Тигр",     emoji: "🐯", sound: "рррр",       image: img("Тигр") },
  { name: "Лев",      emoji: "🦁", sound: "р-р-р",      image: img("Лев") },
  { name: "Медведь",  emoji: "🐻", sound: "ррр",        image: img("Медведь") },
  { name: "Волк",     emoji: "🐺", sound: "вуу",        image: img("Волк") },
  { name: "Лиса",     emoji: "🦊", sound: "тяв",        image: img("Лиса") },
  { name: "Заяц",     emoji: "🐰", sound: "пи-пи",      image: img("Заяц") },
  { name: "Олень",    emoji: "🦌", sound: "э-э-э",      image: img("Олень") },
  { name: "Слон",     emoji: "🐘", sound: "трууу",      image: img("Слон") },
  { name: "Обезьяна", emoji: "🐒", sound: "у-у-у",      image: img("Обезьяна") },
  { name: "Лось",     emoji: "🫎", sound: "хорк-хорк",  image: img("Лось") },
  { name: "Ёж",       emoji: "🦔", sound: "пых-пых",    image: img("Ёж") },
  { name: "Бегемот",  emoji: "🦛", sound: "хрю-хрю",    image: img("Бегемот") },
  { name: "Носорог",  emoji: "🦏", sound: "фрр-р-р",    image: img("Носорог") },
  { name: "Жираф",    emoji: "🦒", sound: "и-и-и",      image: img("Жираф") },
  { name: "Белка",    emoji: "🐿️", sound: "цок-цок",    image: img("Белка") },
];

export const ANIMAL_SETS = { domestic: ANIMALS_DOMESTIC, wild: ANIMALS_WILD };

export function playAnimalSound(animal, onEnd) {
  playSound(animal.file, animal.sound, onEnd);
}
