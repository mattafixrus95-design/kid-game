import { ANIMAL_SETS, playAnimalSound } from "../data/animals";
import { VEHICLE_SETS, playVehicleSound } from "../data/vehicles";
import { COLOR_SETS, isLightColor } from "../data/colors";
import { SHAPE_SETS } from "../data/shapes";
import { NUMBER_RANGES, NUMBER_WORDS } from "../data/numbers";
import VehicleSVG from "../assets/VehicleSVG";
import ShapeSVG from "../assets/ShapeSVG";
import { cardOptionStyle, answerBorder, optionTransform } from "../lib/styles";
import { shuffle } from "../lib/random";

const byName = x => x.name;
const lowerFirst = s => s.charAt(0).toLowerCase() + s.slice(1);

// Общая секция "Уровень обучения", есть у всех игр
function levelSection(settings, onChangeSettings) {
  return {
    label: "Уровень обучения", column: true,
    value: settings.level,
    onChange: v => onChangeSettings({ ...settings, level: v }),
    options: [
      { id: 1, label: "Уровень 1. Повторение", desc: "Повтори за мной" },
      { id: 2, label: "Уровень 2. Узнавание",  desc: "Выбери правильный ответ" },
    ],
  };
}

// Как levelSection, но с дополнительным уровнем "Сочетания" (цвет+машина)
function vehicleLevelSection(settings, onChangeSettings) {
  return {
    label: "Уровень обучения", column: true,
    value: settings.level,
    onChange: v => onChangeSettings({ ...settings, level: v }),
    options: [
      { id: 1, label: "Уровень 1. Повторение", desc: "Повтори за мной" },
      { id: 2, label: "Уровень 2. Узнавание",  desc: "Выбери правильный ответ" },
      { id: 3, label: "Уровень 3. Сочетания",  desc: "Цвет и машина" },
    ],
  };
}

// Название сочетания: согласование рода прилагательного-цвета с существительным-машиной
const comboName = item => `${item.color.forms[item.vehicle.gender]} ${lowerFirst(item.vehicle.name)}`;

// Генерирует все пары {vehicle, color} для набора машин и базовых цветов, в случайном порядке
function vehicleCombos(set) {
  const combos = [];
  for (const vehicle of VEHICLE_SETS[set]) {
    for (const color of COLOR_SETS.basic) {
      combos.push({ vehicle, color });
    }
  }
  return shuffle(combos);
}

export const REGISTRY = {
  animals: {
    emoji: "🐶", title: "Животные", recordKey: "rec_animals",
    defaultSettings: { set: "domestic", level: 1 },
    getDataset: settings => ANIMAL_SETS[settings.set],
    getSettingsSections: (settings, onChangeSettings) => [
      {
        label: "Набор животных", column: false, color: "var(--accent)",
        value: settings.set,
        onChange: v => onChangeSettings({ ...settings, set: v }),
        options: [
          { id: "domestic", label: "🏠 Домашние" },
          { id: "wild",     label: "🌿 Дикие" },
          { id: "all",      label: "🌍 Все" },
        ],
      },
      levelSection(settings, onChangeSettings),
    ],
    getKey: byName, getName: byName,
    introTextLearn: "Назови животное", titleLearn: "Назови животное",
    renderLearn: item => <span style={{ fontSize: "clamp(5rem,22vw,9rem)" }}>{item.emoji}</span>,
    onItemClick: item => playAnimalSound(item),
    introTextQuiz: "Выбери правильное животное", titleQuiz: "Выбери правильное животное",
    renderOption: item => (
      <>
        <span style={{ fontSize: "clamp(2rem,9vw,4rem)" }}>{item.emoji}</span>
        <span style={{ fontSize: "clamp(0.75rem,2.5vw,1.1rem)", fontWeight: 700, color: "#fff", textAlign: "center" }}>{item.name}</span>
      </>
    ),
    getOptionStyle: (item, state) => cardOptionStyle(item.name, state, { background: "var(--accent)" }),
    optionsContainerStyle: { gap: "clamp(10px,3vw,20px)", maxWidth: 560 },
    onSelect: item => playAnimalSound(item),
  },

  vehicles: {
    emoji: "🚗", title: "Машинки", recordKey: "rec_vehicles",
    defaultSettings: { set: "everyday", level: 1 },
    getDataset: settings => settings.level === 3 ? vehicleCombos(settings.set) : VEHICLE_SETS[settings.set],
    getSettingsSections: (settings, onChangeSettings) => [
      {
        label: "Набор машин", column: false, color: "var(--accent)",
        value: settings.set,
        onChange: v => onChangeSettings({ ...settings, set: v }),
        options: [
          { id: "everyday",     label: "🚗 Транспорт" },
          { id: "construction", label: "🚜 Стройка" },
          { id: "special",      label: "🚒 Спецтехника" },
          { id: "all",          label: "🚦 Все" },
        ],
      },
      vehicleLevelSection(settings, onChangeSettings),
    ],
    getKey: item => item.vehicle ? `${item.vehicle.name}_${item.color.name}` : item.name,
    getName: item => item.vehicle ? comboName(item) : item.name,
    introTextLearn: "Назови машину", titleLearn: "Назови машину",
    renderLearn: item => <VehicleSVG name={item.name} size={Math.min(window.innerWidth*0.7, 240)}/>,
    onItemClick: item => playVehicleSound(item),
    introTextQuiz: "Выбери правильную машину", titleQuiz: "Выбери правильную машину",
    renderOption: item => {
      const vehicle = item.vehicle || item;
      const name = item.vehicle ? comboName(item) : item.name;
      return (
        <>
          <VehicleSVG name={vehicle.name} color={item.vehicle ? item.color.css : undefined} size={Math.min(window.innerWidth*0.22, 100)}/>
          <span style={{ fontSize: "clamp(0.65rem,2vw,0.95rem)", fontWeight: 700, color: "var(--text)", textAlign: "center", lineHeight: 1.2 }}>{name}</span>
        </>
      );
    },
    getOptionStyle: (item, state) => cardOptionStyle(item.vehicle ? comboName(item) : item.name, state, { background: "#fff", padding: "6px" }),
    optionsContainerStyle: { gap: "clamp(8px,2vw,14px)", maxWidth: 580 },
    onSelect: item => playVehicleSound(item.vehicle || item),
  },

  numbers: {
    emoji: "🔢", title: "Цифры", recordKey: "rec_numbers",
    defaultSettings: { range: "1-5", level: 1 },
    getDataset: settings => NUMBER_RANGES[settings.range],
    getLabel: settings => settings.range,
    getSettingsSections: (settings, onChangeSettings) => [
      {
        label: "Диапазон цифр", column: false, color: "var(--accent)",
        value: settings.range,
        onChange: v => onChangeSettings({ ...settings, range: v }),
        options: [{ id: "1-3", label: "1–3" }, { id: "1-5", label: "1–5" }, { id: "1-9", label: "1–9" }],
      },
      levelSection(settings, onChangeSettings),
    ],
    getKey: n => n, getName: n => NUMBER_WORDS[n],
    introTextLearn: "Назови цифру", titleLearn: "Назови цифру",
    renderLearn: n => (
      <div style={{ fontSize: "clamp(6rem,32vw,12rem)", fontWeight: 900, color: "var(--primary)", lineHeight: 1, textShadow: "0 6px 0 #E55A2655" }}>{n}</div>
    ),
    introTextQuiz: "Выбери цифру", titleQuiz: "Выбери цифру",
    renderOption: n => n,
    getOptionStyle: (n, { chosen, answerState }) => ({
      flex: 1, aspectRatio: "1/1",
      background: chosen === n ? (answerState === "correct" ? "var(--green)" : "var(--red)") : "var(--primary)",
      color: "#fff", border: "none",
      borderRadius: 24, fontSize: "clamp(2.5rem,12vw,5rem)", fontWeight: 900,
      cursor: "pointer", boxShadow: "0 6px 0 rgba(0,0,0,0.15)",
      transform: optionTransform(chosen, n),
      transition: "transform 0.15s,background 0.2s",
    }),
    optionsContainerStyle: { gap: "clamp(12px,3vw,20px)", maxWidth: 500 },
  },

  colors: {
    emoji: "🎨", title: "Цвета", recordKey: "rec_colors",
    defaultSettings: { set: "basic", level: 1 },
    getDataset: settings => COLOR_SETS[settings.set],
    getSettingsSections: (settings, onChangeSettings) => [
      {
        label: "Количество цветов", column: true, color: "var(--accent)",
        value: settings.set,
        onChange: v => onChangeSettings({ ...settings, set: v }),
        options: [
          { id: "basic",    label: "Базовые",                  desc: "4 цвета" },
          { id: "extended", label: "Базовые + Дополнительные", desc: "9 цветов" },
          { id: "all",      label: "Все цвета",                desc: "13 цветов" },
        ],
      },
      levelSection(settings, onChangeSettings),
    ],
    getKey: byName, getName: byName,
    introTextLearn: "Назови цвет", titleLearn: "Назови цвет",
    renderLearn: item => (
      <div style={{
        width: "clamp(140px,40vw,240px)", height: "clamp(140px,40vw,240px)",
        borderRadius: "50%", background: item.css,
        border: isLightColor(item) ? "4px solid #CCC" : "4px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)", transition: "background 0.3s",
      }}/>
    ),
    introTextQuiz: "Выбери правильный цвет", titleQuiz: "Выбери правильный цвет",
    renderOption: () => null,
    getOptionStyle: (item, { chosen }) => ({
      flex: 1, aspectRatio: "1/1", borderRadius: "50%", background: item.css,
      border: isLightColor(item) ? "4px solid #CCC" : "4px solid rgba(0,0,0,0.08)",
      cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      transform: optionTransform(chosen, item.name),
      transition: "transform 0.15s",
    }),
    optionsContainerStyle: { gap: "clamp(14px,4vw,28px)", maxWidth: 540 },
  },

  shapes: {
    emoji: "🔷", title: "Фигуры", recordKey: "rec_shapes",
    defaultSettings: { set: "simple", level: 1 },
    getDataset: settings => SHAPE_SETS[settings.set],
    getSettingsSections: (settings, onChangeSettings) => [
      {
        label: "Набор фигур", column: true, color: "var(--accent)",
        value: settings.set,
        onChange: v => onChangeSettings({ ...settings, set: v }),
        options: [
          { id: "simple", label: "Простые",             desc: "4 фигуры" },
          { id: "medium", label: "Простые + Составные", desc: "10 фигур" },
          { id: "all",    label: "Все фигуры",          desc: "16 фигур" },
        ],
      },
      levelSection(settings, onChangeSettings),
    ],
    getKey: byName, getName: byName,
    introTextLearn: "Назови фигуру", titleLearn: "Назови фигуру",
    renderLearn: item => <ShapeSVG name={item.name} size={Math.min(window.innerWidth*0.55, 200)}/>,
    introTextQuiz: "Выбери правильную фигуру", titleQuiz: "Выбери правильную фигуру",
    renderOption: item => (
      <>
        <ShapeSVG name={item.name} size={Math.min(window.innerWidth*0.2, 90)}/>
        <span style={{ fontSize: "clamp(0.7rem,2.2vw,1rem)", fontWeight: 700, color: "var(--text)", textAlign: "center" }}>{item.name}</span>
      </>
    ),
    getOptionStyle: (item, state) => cardOptionStyle(item.name, state, { background: "#EEF9F9", boxShadow: "0 6px 0 rgba(0,0,0,0.10)" }),
    optionsContainerStyle: { gap: "clamp(10px,3vw,20px)", maxWidth: 560 },
  },
};
