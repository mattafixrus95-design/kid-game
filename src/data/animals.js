import { speak, playSound } from "../lib/audio";

const ANIMALS_DOMESTIC = [
  { name: "Кошка",   emoji: "🐱", sound: "мяу",      file: "cat.wav" },
  { name: "Собака",  emoji: "🐶", sound: "гав",      file: "dog.wav" },
  { name: "Корова",  emoji: "🐮", sound: "му",       file: "cow.wav" },
  { name: "Коза",    emoji: "🐐", sound: "меее",     file: "goat.wav" },
  { name: "Баран",   emoji: "🐑", sound: "беее",     file: "sheep.wav" },
  { name: "Лошадь",  emoji: "🐴", sound: "и-го-го",  file: "horse.wav" },
  { name: "Петух",   emoji: "🐓", sound: "кукареку", file: "rooster.wav" },
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

// Озвучить звук животного: реальная запись, либо имитация через SpeechSynthesis
export function playAnimalSound(animal) {
  playSound(animal.file, animal.sound);
}
