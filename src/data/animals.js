import { speak } from "../lib/audio";

const ANIMALS_DOMESTIC = [
  { name: "Кошка",   emoji: "🐱", sound: "мяу" },
  { name: "Собака",  emoji: "🐶", sound: "гав" },
  { name: "Корова",  emoji: "🐮", sound: "му" },
  { name: "Коза",    emoji: "🐐", sound: "меее" },
  { name: "Баран",   emoji: "🐑", sound: "беее" },
  { name: "Лошадь",  emoji: "🐴", sound: "и-го-го" },
  { name: "Петух",   emoji: "🐓", sound: "кукареку" },
  { name: "Гусь",    emoji: "🦢", sound: "га-га" },
];
const ANIMALS_WILD = [
  { name: "Тигр",     emoji: "🐯", sound: "рррр" },
  { name: "Лев",      emoji: "🦁", sound: "р-р-р" },
  { name: "Медведь",  emoji: "🐻", sound: "ррр" },
  { name: "Волк",     emoji: "🐺", sound: "вуу" },
  { name: "Лиса",     emoji: "🦊", sound: "тяв" },
  { name: "Заяц",     emoji: "🐰", sound: "пи-пи" },
  { name: "Олень",    emoji: "🦌", sound: "э-э-э" },
  { name: "Слон",     emoji: "🐘", sound: "трууу" },
  { name: "Обезьяна", emoji: "🐒", sound: "у-у-у" },
];
const ANIMALS_ALL = [...ANIMALS_DOMESTIC, ...ANIMALS_WILD];

export const ANIMAL_SETS = { domestic: ANIMALS_DOMESTIC, wild: ANIMALS_WILD, all: ANIMALS_ALL };

// Озвучить звук животного через SpeechSynthesis (имитация)
export function playAnimalSound(animal) {
  speak(animal.sound);
}
