import { ANIMAL_SETS, playAnimalSound } from "../data/animals";
import { VEHICLE_SETS, playVehicleSound } from "../data/vehicles";
import { COLOR_SETS, isLightColor } from "../data/colors";
import { SHAPE_SETS } from "../data/shapes";
import { NUMBER_RANGES, NUMBER_WORDS } from "../data/numbers";
import { FOOD_SETS, playFoodSound } from "../data/food";
import VehicleSVG from "../assets/VehicleSVG";
import ShapeSVG from "../assets/ShapeSVG";
import { cardOptionStyle, answerBorder, optionTransform, learnSvgSize, LEARN_EMOJI_SIZE, LEARN_CIRCLE_SIZE } from "../lib/styles";
import { shuffle } from "../lib/random";

const byName = x => x.name;
const lowerFirst = s => s.charAt(0).toLowerCase() + s.slice(1);

function multiSetSection(label, settings, onChangeSettings, options, color, column = false) {
  return {
    label, multi: true, column, color,
    values: settings.sets,
    onToggle: id => {
      const has = settings.sets.includes(id);
      const next = has ? settings.sets.filter(x => x !== id) : [...settings.sets, id];
      onChangeSettings({ ...settings, sets: next });
    },
    options,
  };
}

const comboName = item => `${item.color.forms[item.vehicle.gender]} ${lowerFirst(item.vehicle.name)}`;

function vehicleCombos(sets) {
  const combos = [];
  for (const setId of sets) {
    for (const vehicle of VEHICLE_SETS[setId]) {
      for (const color of COLOR_SETS.basic) {
        combos.push({ vehicle, color });
      }
    }
  }
  return shuffle(combos);
}

export const REGISTRY = {
  animals: {
    emoji: "🐶", title: "Животные", recordKey: "rec_animals",
    supportsMechanics: ["words", "recognition", "categories", "who_missing", "memori", "sequence", "odd_one", "sort_groups", "continue", "spot_diff", "find_fast", "quantity", "counting", "more_less"],
    categoryLabel: "животное",
    defaultSettings: { sets: ["domestic"] },
    getDataset: settings => settings.sets.flatMap(s => ANIMAL_SETS[s]),
    getSettingsSections: (settings, onChangeSettings) => [
      multiSetSection("Набор животных", settings, onChangeSettings, [
        { id: "domestic", label: "🏠 Домашние", desc: "кошка, собака, корова, лошадь..." },
        { id: "wild",     label: "🌿 Дикие",    desc: "волк, лиса, медведь, заяц..." },
      ], "var(--accent)", true),
    ],
    getKey: byName, getName: byName,
    introTextLearn: "Назови животное", titleLearn: "Назови животное",
    renderLearn: item => item.image
      ? <img src={item.image} alt={item.name} style={{ width: "clamp(140px,55vw,260px)", height: "clamp(140px,55vw,260px)", objectFit: "contain" }}/>
      : <span style={{ fontSize: LEARN_EMOJI_SIZE }}>{item.emoji}</span>,
    onItemClick: item => playAnimalSound(item),
    introTextQuiz: "Выбери правильное животное", titleQuiz: "Выбери правильное животное",
    renderOption: item => (
      <>
        {item.image
          ? <img src={item.image} alt={item.name} style={{ width: "clamp(52px,18vw,90px)", height: "clamp(52px,18vw,90px)", objectFit: "contain" }}/>
          : <span style={{ fontSize: "clamp(3rem,18vw,6rem)" }}>{item.emoji}</span>
        }
        <span style={{ fontSize: "clamp(0.85rem,3vw,1.3rem)", fontWeight: 700, color: "#fff", textAlign: "center" }}>{item.name}</span>
      </>
    ),
    getOptionStyle: (item, state) => cardOptionStyle(item.name, state, { background: "var(--accent)" }),
    optionsContainerStyle: { gap: "clamp(10px,3vw,20px)", maxWidth: 560 },
    onSelect: item => playAnimalSound(item),
  },

  vehicles: {
    emoji: "🚗", title: "Транспорт", recordKey: "rec_vehicles",
    supportsMechanics: ["words", "recognition", "attributes", "memori", "sequence", "odd_one"],
    defaultSettings: { sets: ["everyday"] },
    getDataset: (settings, mechanic) => mechanic === "attributes" ? vehicleCombos(settings.sets) : settings.sets.flatMap(s => VEHICLE_SETS[s]),
    getSettingsSections: (settings, onChangeSettings) => [
      multiSetSection("Набор машин", settings, onChangeSettings, [
        { id: "everyday",     label: "🚗 Транспорт",   desc: "легковые, автобус, грузовик..." },
        { id: "construction", label: "🚜 Стройка",      desc: "экскаватор, кран, бульдозер..." },
        { id: "special",      label: "🚒 Спецтехника",  desc: "пожарная, скорая, полиция..." },
      ], "var(--accent)", true),
    ],
    getKey: item => item.vehicle ? `${item.vehicle.name}_${item.color.name}` : item.name,
    getName: item => item.vehicle ? comboName(item) : item.name,
    introTextLearn: "Назови машину", titleLearn: "Назови машину",
    renderLearn: item => <VehicleSVG name={item.name} size={learnSvgSize(280)}/>,
    onItemClick: item => playVehicleSound(item),
    introTextQuiz: "Выбери правильную машину", titleQuiz: "Выбери правильную машину",
    renderOption: item => {
      const vehicle = item.vehicle || item;
      const name = item.vehicle ? comboName(item) : item.name;
      return (
        <>
          <VehicleSVG name={vehicle.name} color={item.vehicle ? item.color.css : undefined} size={Math.min(window.innerWidth*0.36, 160)}/>
          <span style={{ fontSize: "clamp(0.8rem,2.6vw,1.15rem)", fontWeight: 700, color: "var(--text)", textAlign: "center", lineHeight: 1.2 }}>{name}</span>
        </>
      );
    },
    getOptionStyle: (item, state) => cardOptionStyle(item.vehicle ? comboName(item) : item.name, state, { background: "#fff", padding: "6px" }),
    optionsContainerStyle: { gap: "clamp(8px,2vw,14px)", maxWidth: 580 },
    onSelect: item => playVehicleSound(item.vehicle || item),
  },

  food: {
    emoji: "🍎", title: "Еда", recordKey: "rec_food",
    supportsMechanics: ["words", "recognition", "categories", "who_missing", "memori", "sequence", "odd_one", "sort_groups", "continue", "spot_diff", "find_fast", "quantity", "counting", "more_less"],
    getCategoryLabel: settings => {
      const hasFruits = settings.sets.some(s => s.startsWith("fruits_"));
      const hasVegs   = settings.sets.some(s => s.startsWith("vegetables_"));
      if (hasFruits && !hasVegs) return "фрукт";
      if (hasVegs && !hasFruits) return "овощ";
      return "еду";
    },
    defaultSettings: { sets: ["fruits_simple"] },
    getDataset: settings => settings.sets.flatMap(s => FOOD_SETS[s]),
    getSettingsSections: (settings, onChangeSettings) => [
      multiSetSection("Фрукты", settings, onChangeSettings, [
        { id: "fruits_simple", label: "🍎 Простые",        desc: "15 фруктов" },
        { id: "fruits_extra",  label: "🍍 Дополнительные", desc: "10 фруктов" },
        { id: "fruits_exotic", label: "🥭 Экзотические",   desc: "10 фруктов" },
      ], "#66BB6A", true),
      multiSetSection("Овощи", settings, onChangeSettings, [
        { id: "vegetables_simple", label: "🥔 Простые",        desc: "15 овощей" },
        { id: "vegetables_extra",  label: "🌽 Дополнительные", desc: "10 овощей" },
        { id: "vegetables_exotic", label: "🌻 Экзотические",   desc: "10 овощей" },
      ], "#FF8F00", true),
    ],
    getKey: byName, getName: byName,
    introTextLearn: "Назови", titleLearn: "Назови",
    renderLearn: item => item.image
      ? <img src={item.image} alt={item.name} style={{ width: "clamp(140px,55vw,260px)", height: "clamp(140px,55vw,260px)", objectFit: "contain" }}/>
      : <span style={{ fontSize: LEARN_EMOJI_SIZE }}>{item.emoji}</span>,
    onItemClick: item => playFoodSound(item),
    introTextQuiz: "Выбери правильный ответ", titleQuiz: "Выбери правильный ответ",
    renderOption: item => (
      <>
        {item.image
          ? <img src={item.image} alt={item.name} style={{ width: "clamp(52px,18vw,90px)", height: "clamp(52px,18vw,90px)", objectFit: "contain" }}/>
          : <span style={{ fontSize: "clamp(3rem,18vw,6rem)" }}>{item.emoji}</span>
        }
        <span style={{ fontSize: "clamp(0.85rem,3vw,1.3rem)", fontWeight: 700, color: "#fff", textAlign: "center" }}>{item.name}</span>
      </>
    ),
    getOptionStyle: (item, state) => cardOptionStyle(item.name, state, { background: "#66BB6A" }),
    optionsContainerStyle: { gap: "clamp(10px,3vw,20px)", maxWidth: 560 },
    onSelect: item => playFoodSound(item),
  },

  colors: {
    emoji: "🎨", title: "Цвета", recordKey: "rec_colors",
    supportsMechanics: ["words", "recognition"],
    defaultSettings: { sets: ["basic"] },
    getDataset: settings => settings.sets.flatMap(s => COLOR_SETS[s]),
    getSettingsSections: (settings, onChangeSettings) => [
      multiSetSection("Наборы цветов", settings, onChangeSettings, [
        { id: "basic",      label: "Базовые",        desc: "4 цвета" },
        { id: "additional", label: "Дополнительные", desc: "5 цветов" },
        { id: "shades",     label: "Оттенки",        desc: "Еще 5 цветов" },
      ], "var(--accent)", true),
    ],
    getKey: byName, getName: byName,
    introTextLearn: "Назови цвет", titleLearn: "Назови цвет",
    renderLearn: item => (
      <div style={{
        width: LEARN_CIRCLE_SIZE, height: LEARN_CIRCLE_SIZE,
        borderRadius: "50%", background: item.css,
        border: isLightColor(item) ? "4px solid #CCC" : "4px solid rgba(0,0,0,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)", transition: "background 0.3s",
      }}/>
    ),
    introTextQuiz: "Выбери правильный цвет", titleQuiz: "Выбери правильный цвет",
    renderOption: () => null,
    getOptionStyle: (item, { chosen }) => ({
      flex: "1 1 calc(50% - 14px)", minWidth: 120, maxWidth: 260, aspectRatio: "1/1", borderRadius: "50%", background: item.css,
      border: isLightColor(item) ? "4px solid #CCC" : "4px solid rgba(0,0,0,0.08)",
      cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      transform: optionTransform(chosen, item.name),
      transition: "transform 0.15s",
    }),
    optionsContainerStyle: { gap: "clamp(14px,4vw,28px)", maxWidth: 540 },
  },

  shapes: {
    emoji: "🔷", title: "Фигуры", recordKey: "rec_shapes",
    supportsMechanics: ["words", "recognition", "memori", "categories"],
    defaultSettings: { sets: ["simple"] },
    getDataset: settings => settings.sets.flatMap(s => SHAPE_SETS[s]),
    getSettingsSections: (settings, onChangeSettings) => [
      multiSetSection("Набор фигур", settings, onChangeSettings, [
        { id: "simple",     label: "Простые",   desc: "4 фигуры" },
        { id: "composite",  label: "Составные", desc: "8 фигур" },
        { id: "volumetric", label: "Объёмные",  desc: "4 фигуры" },
      ], "var(--accent)", true),
    ],
    getKey: byName, getName: byName,
    categoryLabel: "фигуру",
    renderCategoryItem: item => <ShapeSVG name={item.name} size={Math.min(window.innerWidth * 0.22, 90)}/>,
    introTextLearn: "Назови фигуру", titleLearn: "Назови фигуру",
    renderLearn: item => <ShapeSVG name={item.name} size={learnSvgSize(280)}/>,
    introTextQuiz: "Выбери правильную фигуру", titleQuiz: "Выбери правильную фигуру",
    renderOption: item => (
      <>
        <ShapeSVG name={item.name} size={Math.min(window.innerWidth*0.32, 140)}/>
        <span style={{ fontSize: "clamp(0.85rem,2.6vw,1.15rem)", fontWeight: 700, color: "var(--text)", textAlign: "center" }}>{item.name}</span>
      </>
    ),
    getOptionStyle: (item, state) => cardOptionStyle(item.name, state, { background: "#FFF1E8", boxShadow: "0 6px 0 rgba(0,0,0,0.10)" }),
    optionsContainerStyle: { gap: "clamp(10px,3vw,20px)", maxWidth: 560 },
  },

  numbers: {
    emoji: "🔢", title: "Цифры", recordKey: "rec_numbers",
    supportsMechanics: ["numbers", "continue"],
    defaultSettings: { range: "1-5" },
    optCount: 2,
    getDataset: settings => NUMBER_RANGES[settings.range],
    getLabel: settings => settings.range,
    getSettingsSections: (settings, onChangeSettings) => [
      {
        label: "Диапазон цифр", column: true, color: "var(--accent)",
        value: settings.range,
        onChange: v => onChangeSettings({ ...settings, range: v }),
        options: [
          { id: "1-3", label: "🔢 1 – 3", desc: "для самых маленьких" },
          { id: "1-5", label: "🔢 1 – 5", desc: "базовый набор" },
          { id: "1-9", label: "🔢 1 – 9", desc: "все однозначные цифры" },
        ],
      },
    ],
    getKey: n => n, getName: n => NUMBER_WORDS[n],
    introTextLearn: "Назови цифру", titleLearn: "Назови цифру",
    renderLearn: n => (
      <div style={{ fontSize: LEARN_EMOJI_SIZE, fontWeight: 900, color: "var(--primary)", lineHeight: 1, textShadow: "0 6px 0 #E55A2655" }}>{n}</div>
    ),
    introTextQuiz: "Выбери цифру", titleQuiz: "Выбери цифру",
    renderOption: n => n,
    getOptionStyle: (n, { chosen, answerState }) => ({
      flex: "1 1 calc(50% - 8px)", minWidth: 120, maxWidth: 260, aspectRatio: "1/1",
      background: chosen === n ? (answerState === "correct" ? "var(--green)" : "var(--red)") : "var(--primary)",
      color: "#fff", border: "none",
      borderRadius: 24, fontSize: "clamp(3rem,16vw,6rem)", fontWeight: 900,
      cursor: "pointer", boxShadow: "0 6px 0 rgba(0,0,0,0.15)",
      transform: optionTransform(chosen, n),
      transition: "transform 0.15s,background 0.2s",
    }),
    optionsContainerStyle: { gap: "clamp(12px,3vw,20px)", maxWidth: 500 },
  },
};
