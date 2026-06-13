import { speak, playSound } from "../lib/audio";

const VEHICLES_EVERYDAY = [
  { name: "Легковая машина", color: "#E53935", sound: "би-би", file: "horn_beep.wav" },
  { name: "Грузовик",        color: "#546E7A", sound: "ту-ту" },
  { name: "Автобус",         color: "#FF8F00", sound: "па-па", file: "bus_beep.wav" },
  { name: "Такси",           color: "#FDD835", sound: "би-би", file: "horn_beep.wav" },
  { name: "Мотоцикл",        color: "#8E24AA", sound: "вр-р-р" },
];
const VEHICLES_CONSTRUCTION = [
  { name: "Экскаватор", color: "#F9A825", sound: "ж-ж-ж" },
  { name: "Бульдозер",  color: "#FF8F00", sound: "р-р-р" },
  { name: "Автокран",   color: "#E53935", sound: "дзынь-дзынь" },
  { name: "Каток",      color: "#FDD835", sound: "ух-ух" },
  { name: "Трактор",    color: "#1565C0", sound: "тр-р-р" },
  { name: "Самосвал",   color: "#1E88E5", sound: "би-би", file: "horn_beep.wav" },
];
const VEHICLES_SPECIAL = [
  { name: "Пожарная машина",   color: "#D32F2F", sound: "у-у-у", file: "fire_truck.wav" },
  { name: "Скорая помощь",     color: "#FFFFFF", sound: "иу-иу", file: "ambulance.m4a" },
  { name: "Полицейская машина",color: "#1565C0", sound: "ву-ву", file: "police.ogg" },
  { name: "Эвакуатор",         color: "#2E7D32", sound: "би-би", file: "horn_beep.wav" },
  { name: "Мусорная машина",   color: "#388E3C", sound: "др-р-р" },
  { name: "Бензовоз",          color: "#E65100", sound: "би-би", file: "horn_beep.wav" },
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
