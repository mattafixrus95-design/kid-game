import { speak, playSound } from "../lib/audio";

const vehicleImages = import.meta.glob('/src/assets/vehicles/*.png', { eager: true });
function img(name) {
  return vehicleImages[`/src/assets/vehicles/${name}.png`]?.default;
}

const VEHICLES_EVERYDAY = [
  { name: "Легковая машина", image: img("Машина"),           color: "#E53935", sound: "би-би", file: "horn_beep.wav", gender: "f" },
  { name: "Грузовик",        image: img("Грузовик"),         color: "#90A4AE", sound: "ту-ту", gender: "m" },
  { name: "Автобус",         image: img("Автобус"),          color: "#FF8F00", sound: "па-па", file: "bus_beep.wav", gender: "m" },
  { name: "Такси",           image: img("Такси"),            color: "#FDD835", sound: "би-би", file: "horn_beep.wav", gender: "n" },
  { name: "Мотоцикл",        image: img("Мотоцикл"),        color: "#8E24AA", sound: "вр-р-р", gender: "m" },
];
const VEHICLES_CONSTRUCTION = [
  { name: "Экскаватор", image: img("Экскаватор"), color: "#F9A825", sound: "ж-ж-ж", gender: "m" },
  { name: "Бульдозер",  image: img("Бульдозер"),  color: "#FF8F00", sound: "р-р-р", gender: "m" },
  { name: "Автокран",   image: img("Автокран"),   color: "#E53935", sound: "дзынь-дзынь", gender: "m" },
  { name: "Каток",      image: img("Каток"),      color: "#FDD835", sound: "ух-ух", gender: "m" },
  { name: "Трактор",    image: img("Трактор"),    color: "#1565C0", sound: "тр-р-р", gender: "m" },
  { name: "Самосвал",   image: img("Самосвал"),   color: "#1E88E5", sound: "би-би", file: "horn_beep.wav", gender: "m" },
];
const VEHICLES_SPECIAL = [
  { name: "Пожарная машина",   image: img("Пожарная машина"),   color: "#D32F2F", sound: "у-у-у", file: "fire_truck.wav", gender: "f" },
  { name: "Скорая помощь",     image: img("Скорая помощь"),     color: "#FFFFFF", sound: "иу-иу", file: "ambulance.m4a", gender: "f" },
  { name: "Полицейская машина",image: img("Полицейская машина"),color: "#1565C0", sound: "ву-ву", file: "police.ogg", gender: "f" },
  { name: "Эвакуатор",         image: img("Эвакуатор"),         color: "#2E7D32", sound: "би-би", file: "horn_beep.wav", gender: "m" },
  { name: "Мусорная машина",   image: img("Мусорная машина"),   color: "#8BC34A", sound: "др-р-р", gender: "f" },
  { name: "Бензовоз",          image: img("Бензовоз"),          color: "#FF8F00", sound: "би-би", file: "horn_beep.wav", gender: "m" },
];

export const VEHICLE_SETS = {
  everyday:     VEHICLES_EVERYDAY,
  construction: VEHICLES_CONSTRUCTION,
  special:      VEHICLES_SPECIAL,
};

// Озвучить звук машины: реальная запись, либо имитация через SpeechSynthesis
export function playVehicleSound(vehicle) {
  playSound(vehicle.file, vehicle.sound);
}
