// ============================================================
// РАЗВИВАШКИ — App.jsx  v4
// ============================================================

import { useState, useEffect, useRef } from "react";

// ============================================================
// ДАННЫЕ: животные (по группам)
// ============================================================
const ANIMALS_DOMESTIC = [
  { name: "Кошка",   emoji: "🐱", sound: "мяу" },
  { name: "Собака",  emoji: "🐶", sound: "гав" },
  { name: "Корова",  emoji: "🐮", sound: "му" },
  { name: "Коза",    emoji: "🐐", sound: "меее" },
  { name: "Баран",   emoji: "🐑", sound: "беее" },
  { name: "Лошадь",  emoji: "🐴", sound: "и-го-го" },
  { name: "Осёл",    emoji: "🫏", sound: "иа" },
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

const ANIMAL_SETS = { domestic: ANIMALS_DOMESTIC, wild: ANIMALS_WILD, all: ANIMALS_ALL };

// Озвучить звук животного через SpeechSynthesis (имитация)
function playAnimalSound(animal) {
  speak(animal.sound);
}

// ============================================================
// ДАННЫЕ: машины (по группам)
// ============================================================
const VEHICLES_EVERYDAY = [
  { name: "Легковая машина", color: "#E53935" },
  { name: "Грузовик",        color: "#546E7A" },
  { name: "Автобус",         color: "#FF8F00" },
  { name: "Такси",           color: "#FDD835" },
  { name: "Мотоцикл",        color: "#8E24AA" },
];
const VEHICLES_CONSTRUCTION = [
  { name: "Экскаватор", color: "#F9A825" },
  { name: "Бульдозер",  color: "#FF8F00" },
  { name: "Автокран",   color: "#E53935" },
  { name: "Каток",      color: "#FDD835" },
  { name: "Трактор",    color: "#1565C0" },
  { name: "Самосвал",   color: "#1E88E5" },
];
const VEHICLES_SPECIAL = [
  { name: "Пожарная машина",   color: "#D32F2F" },
  { name: "Скорая помощь",     color: "#FFFFFF" },
  { name: "Полицейская машина",color: "#1565C0" },
  { name: "Эвакуатор",         color: "#2E7D32" },
  { name: "Мусорная машина",   color: "#388E3C" },
  { name: "Бензовоз",          color: "#E65100" },
];
const VEHICLES_ALL_MAP = {};
[...VEHICLES_EVERYDAY, ...VEHICLES_CONSTRUCTION, ...VEHICLES_SPECIAL].forEach(v => { VEHICLES_ALL_MAP[v.name] = v; });

const VEHICLE_SETS = {
  everyday:     VEHICLES_EVERYDAY,
  construction: VEHICLES_CONSTRUCTION,
  special:      VEHICLES_SPECIAL,
};

// ============================================================
// SVG машин — единый стиль, вид сбоку слева направо
// vB = "0 0 200 120", колёса одинаковые r=18
// ============================================================
const W = ({ cx }) => ( // стандартное колесо
  <>
    <circle cx={cx} cy={98} r={18} fill="#222"/>
    <circle cx={cx} cy={98} r={11} fill="#555"/>
    <circle cx={cx} cy={98} r={4}  fill="#999"/>
  </>
);
const WINDOW_STYLE = { fill: "#B3E5FC" };

const VehicleSVG = ({ name, size = 140 }) => {
  const vb = "0 0 200 120";
  const w = size; const h = size * 0.6;

  const shapes = {
    /* ---- ЛЕГКОВАЯ МАШИНА ---- */
    "Легковая машина": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Кузов */}
        <rect x="10" y="60" width="180" height="35" rx="8" fill="#E53935"/>
        {/* Крыша */}
        <path d="M50,60 Q60,30 100,26 Q140,22 155,60 Z" fill="#C62828"/>
        {/* Стёкла */}
        <path d="M58,58 Q66,38 100,34 Q125,32 135,58 Z" {...WINDOW_STYLE}/>
        {/* Фары */}
        <rect x="170" y="68" width="16" height="10" rx="3" fill="#FFEE58"/>
        <rect x="14" y="68" width="12" height="10" rx="3" fill="#EF9A9A"/>
        <W cx={52}/><W cx={148}/>
      </svg>
    ),
    /* ---- ГРУЗОВИК ---- */
    "Грузовик": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Кузов */}
        <rect x="8"  y="38" width="110" height="52" rx="5" fill="#90A4AE"/>
        <rect x="6"  y="36" width="6"   height="55" rx="3" fill="#607D8B"/>
        {/* Кабина */}
        <rect x="118" y="44" width="70" height="46" rx="8" fill="#546E7A"/>
        {/* Стекло */}
        <rect x="128" y="50" width="48" height="28" rx="4" {...WINDOW_STYLE}/>
        {/* Решётка */}
        <rect x="184" y="68" width="8" height="18" rx="2" fill="#37474F"/>
        <W cx={42}/><W cx={86}/><W cx={148}/><W cx={178}/>
      </svg>
    ),
    /* ---- АВТОБУС ---- */
    "Автобус": (
      <svg width={w} height={h} viewBox={vb}>
        <rect x="8" y="32" width="184" height="58" rx="10" fill="#FF8F00"/>
        {/* Окна */}
        {[22,56,90,124,158].map(x => (
          <rect key={x} x={x} y="40" width="28" height="20" rx="4" {...WINDOW_STYLE}/>
        ))}
        {/* Дверь */}
        <rect x="156" y="56" width="22" height="34" rx="4" fill="#E65100"/>
        {/* Фары */}
        <rect x="184" y="48" width="10" height="10" rx="2" fill="#FFEE58"/>
        <W cx={42}/><W cx={158}/>
      </svg>
    ),
    /* ---- ТАКСИ ---- */
    "Такси": (
      <svg width={w} height={h} viewBox={vb}>
        <rect x="10" y="60" width="180" height="35" rx="8" fill="#FDD835"/>
        <path d="M50,60 Q60,30 100,26 Q140,22 155,60 Z" fill="#F9A825"/>
        <path d="M58,58 Q66,38 100,34 Q125,32 135,58 Z" {...WINDOW_STYLE}/>
        {/* Табличка TAXI */}
        <rect x="80" y="18" width="40" height="12" rx="4" fill="#F44336"/>
        <text x="100" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">TAXI</text>
        {/* Шашка */}
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={10+i*20} y="90" width="10" height="5" fill={i%2===0?"#222":"#FDD835"}/>
        ))}
        <rect x="170" y="68" width="16" height="10" rx="3" fill="#FFEE58"/>
        <W cx={52}/><W cx={148}/>
      </svg>
    ),
    /* ---- МОТОЦИКЛ ---- */
    "Мотоцикл": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Рама */}
        <line x1="50" y1="80" x2="150" y2="80" stroke="#8E24AA" strokeWidth="8" strokeLinecap="round"/>
        <line x1="150" y1="80" x2="165" y2="55" stroke="#7B1FA2" strokeWidth="7" strokeLinecap="round"/>
        <line x1="50" y1="80" x2="55" y2="50" stroke="#7B1FA2" strokeWidth="7" strokeLinecap="round"/>
        {/* Сиденье */}
        <rect x="80" y="62" width="60" height="12" rx="6" fill="#4A148C"/>
        {/* Бак */}
        <ellipse cx="110" cy="66" rx="22" ry="10" fill="#6A1B9A"/>
        {/* Руль */}
        <rect x="150" y="44" width="4" height="18" rx="2" fill="#555"/>
        <rect x="144" y="44" width="18" height="5" rx="2" fill="#555"/>
        {/* Выхлоп */}
        <path d="M55,85 Q40,90 30,88" stroke="#999" strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Фара */}
        <circle cx="162" cy="58" r="7" fill="#FFEE58"/>
        <W cx={50}/><W cx={150}/>
      </svg>
    ),
    /* ---- ЭКСКАВАТОР ---- */
    "Экскаватор": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Гусеницы */}
        <rect x="30" y="78" width="130" height="20" rx="10" fill="#333"/>
        <rect x="35" y="82" width="120" height="12" rx="6" fill="#555"/>
        {[45,70,95,120,145].map(cx => <circle key={cx} cx={cx} cy={88} r={8} fill="#222"/>)}
        {/* Корпус */}
        <rect x="50" y="50" width="110" height="32" rx="6" fill="#F9A825"/>
        {/* Кабина */}
        <rect x="100" y="26" width="56" height="28" rx="6" fill="#F57F17"/>
        <rect x="108" y="31" width="40" height="18" rx="3" {...WINDOW_STYLE}/>
        {/* Стрела */}
        <line x1="62" y1="65" x2="30" y2="42" stroke="#E65100" strokeWidth="8" strokeLinecap="round"/>
        <line x1="30" y1="42" x2="14" y2="22" stroke="#E65100" strokeWidth="6" strokeLinecap="round"/>
        {/* Ковш */}
        <path d="M4,14 Q0,4 12,2 L18,18 Q8,22 4,14Z" fill="#BF360C"/>
        <line x1="6" y1="12" x2="4" y2="4"  stroke="#BF360C" strokeWidth="2.5"/>
        <line x1="10" y1="11" x2="9" y2="3"  stroke="#BF360C" strokeWidth="2.5"/>
        <line x1="14" y1="11" x2="14" y2="3" stroke="#BF360C" strokeWidth="2.5"/>
      </svg>
    ),
    /* ---- БУЛЬДОЗЕР ---- */
    "Бульдозер": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Гусеницы */}
        <rect x="30" y="78" width="140" height="20" rx="10" fill="#333"/>
        <rect x="35" y="82" width="130" height="12" rx="6" fill="#555"/>
        {[50,80,110,140,160].map(cx => <circle key={cx} cx={cx} cy={88} r={8} fill="#222"/>)}
        {/* Корпус */}
        <rect x="40" y="46" width="120" height="36" rx="6" fill="#FF8F00"/>
        {/* Кабина */}
        <rect x="80" y="22" width="74" height="28" rx="6" fill="#E65100"/>
        <rect x="88" y="27" width="58" height="18" rx="3" {...WINDOW_STYLE}/>
        {/* Отвал */}
        <rect x="8"  y="46" width="36" height="36" rx="5" fill="#F57F17"/>
        <rect x="4"  y="52" width="8"  height="24" rx="3" fill="#BF360C"/>
        <rect x="4"  y="78" width="40" height="7"  rx="2" fill="#BF360C"/>
        {/* Гидроцилиндры */}
        <line x1="36" y1="52" x2="54" y2="46" stroke="#999" strokeWidth="5" strokeLinecap="round"/>
        <line x1="36" y1="64" x2="54" y2="60" stroke="#999" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    /* ---- АВТОКРАН ---- */
    "Автокран": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Шасси */}
        <rect x="8" y="68" width="184" height="22" rx="6" fill="#B71C1C"/>
        {/* Кабина */}
        <rect x="140" y="40" width="52" height="30" rx="7" fill="#C62828"/>
        <rect x="148" y="45" width="36" height="20" rx="3" {...WINDOW_STYLE}/>
        {/* Платформа крана */}
        <rect x="20" y="56" width="115" height="16" rx="5" fill="#E53935"/>
        {/* Основание стрелы */}
        <rect x="30" y="44" width="14" height="16" rx="4" fill="#555"/>
        {/* Стрела */}
        <line x1="37" y1="46" x2="140" y2="8" stroke="#FF5722" strokeWidth="9" strokeLinecap="round"/>
        {/* Конец стрелы — люлька */}
        <rect x="132" y="2" width="18" height="14" rx="3" fill="#BF360C"/>
        <line x1="140" y1="8" x2="140" y2="16" stroke="#BF360C" strokeWidth="2"/>
        {/* Трос */}
        <line x1="140" y1="8" x2="138" y2="48" stroke="#888" strokeWidth="2" strokeDasharray="4,3"/>
        <path d="M134,48 Q132,56 138,56 Q144,56 142,48" fill="none" stroke="#555" strokeWidth="2.5"/>
        <W cx={40}/><W cx={76}/><W cx={148}/><W cx={174}/>
      </svg>
    ),
    /* ---- КАТОК ---- */
    "Каток": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Корпус */}
        <rect x="68" y="46" width="116" height="34" rx="6" fill="#FDD835"/>
        {/* Кабина */}
        <rect x="72" y="22" width="108" height="28" rx="6" fill="#F9A825"/>
        <rect x="82" y="27" width="88" height="18" rx="3" {...WINDOW_STYLE}/>
        {/* Передний вал */}
        <ellipse cx="34" cy="84" rx="30" ry="22" fill="#555"/>
        <ellipse cx="34" cy="84" rx="22" ry="15" fill="#777"/>
        <ellipse cx="34" cy="84" rx="9"  ry="6"  fill="#999"/>
        {/* Рама соединения */}
        <rect x="58" y="68" width="14" height="20" rx="4" fill="#E65100"/>
        {/* Заднее колесо */}
        <W cx={162}/>
      </svg>
    ),
    /* ---- ТРАКТОР ---- */
    "Трактор": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Кабина */}
        <rect x="90" y="22" width="60" height="44" rx="7" fill="#1565C0"/>
        <rect x="98" y="28" width="44" height="26" rx="4" {...WINDOW_STYLE}/>
        {/* Корпус */}
        <rect x="30" y="56" width="130" height="28" rx="6" fill="#1976D2"/>
        {/* Труба */}
        <rect x="138" y="8" width="8" height="20" rx="3" fill="#555"/>
        {/* Большое заднее колесо */}
        <circle cx="55"  cy="92" r="26" fill="#222"/>
        <circle cx="55"  cy="92" r="18" fill="#444"/>
        <circle cx="55"  cy="92" r="7"  fill="#888"/>
        {/* Маленькое переднее колесо */}
        <circle cx="158" cy="94" r="16" fill="#222"/>
        <circle cx="158" cy="94" r="10" fill="#444"/>
        <circle cx="158" cy="94" r="4"  fill="#888"/>
      </svg>
    ),
    /* ---- САМОСВАЛ ---- */
    "Самосвал": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Шасси */}
        <rect x="8" y="70" width="184" height="22" rx="6" fill="#1565C0"/>
        {/* Кабина */}
        <rect x="136" y="36" width="56" height="36" rx="7" fill="#1976D2"/>
        <rect x="144" y="41" width="40" height="24" rx="3" {...WINDOW_STYLE}/>
        {/* Кузов поднятый */}
        <polygon points="14,72 122,72 106,24 14,24" fill="#1E88E5"/>
        <rect x="10" y="22" width="8" height="52" rx="3" fill="#0D47A1"/>
        {/* Гидроцилиндр */}
        <line x1="122" y1="72" x2="106" y2="42" stroke="#999" strokeWidth="6" strokeLinecap="round"/>
        <W cx={42}/><W cx={82}/><W cx={152}/><W cx={175}/>
      </svg>
    ),
    /* ---- ПОЖАРНАЯ МАШИНА ---- */
    "Пожарная машина": (
      <svg width={w} height={h} viewBox={vb}>
        <rect x="8" y="52" width="184" height="38" rx="7" fill="#D32F2F"/>
        <rect x="120" y="28" width="68" height="26" rx="7" fill="#B71C1C"/>
        <rect x="128" y="33" width="52" height="16" rx="3" {...WINDOW_STYLE}/>
        {/* Лестница */}
        <rect x="14" y="30" width="100" height="6" rx="2" fill="#EF9A9A"/>
        {[20,40,60,80,100].map(x => <rect key={x} x={x} y="24" width="5" height="20" rx="1" fill="#EF9A9A"/>)}
        {/* Маячок */}
        <rect x="145" y="20" width="14" height="8" rx="3" fill="#FFEE58"/>
        {/* Шланг */}
        <path d="M14,60 Q10,50 18,46" stroke="#EF9A9A" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <W cx={42}/><W cx={80}/><W cx={152}/><W cx={175}/>
      </svg>
    ),
    /* ---- СКОРАЯ ПОМОЩЬ ---- */
    "Скорая помощь": (
      <svg width={w} height={h} viewBox={vb}>
        <rect x="8" y="44" width="184" height="46" rx="7" fill="#EEEEEE"/>
        <rect x="120" y="26" width="68" height="22" rx="7" fill="#E0E0E0"/>
        <rect x="128" y="30" width="52" height="14" rx="3" {...WINDOW_STYLE}/>
        {/* Крест */}
        <rect x="50" y="50" width="48" height="14" rx="3" fill="#E53935"/>
        <rect x="68" y="42" width="14" height="30" rx="3" fill="#E53935"/>
        {/* Полоса */}
        <rect x="8"  y="72" width="184" height="10" fill="#E53935"/>
        {/* Маячок */}
        <rect x="145" y="18" width="14" height="8" rx="3" fill="#1E88E5"/>
        <W cx={42}/><W cx={80}/><W cx={152}/><W cx={175}/>
      </svg>
    ),
    /* ---- ПОЛИЦЕЙСКАЯ МАШИНА ---- */
    "Полицейская машина": (
      <svg width={w} height={h} viewBox={vb}>
        <rect x="10" y="60" width="180" height="34" rx="8" fill="#1565C0"/>
        <path d="M50,60 Q60,30 100,26 Q140,22 155,60 Z" fill="#0D47A1"/>
        <path d="M58,58 Q66,38 100,34 Q125,32 135,58 Z" {...WINDOW_STYLE}/>
        {/* Полоса */}
        <rect x="10" y="78" width="180" height="8" fill="#FFEE58"/>
        {/* Маячок */}
        <rect x="85" y="18" width="30" height="10" rx="4" fill="#D32F2F"/>
        <rect x="86" y="18" width="12" height="10" rx="3" fill="#1565C0"/>
        <rect x="102" y="18" width="12" height="10" rx="3" fill="#D32F2F"/>
        <W cx={52}/><W cx={148}/>
      </svg>
    ),
    /* ---- ЭВАКУАТОР ---- */
    "Эвакуатор": (
      <svg width={w} height={h} viewBox={vb}>
        <rect x="8" y="64" width="184" height="22" rx="6" fill="#2E7D32"/>
        <rect x="130" y="36" width="60" height="30" rx="7" fill="#388E3C"/>
        <rect x="138" y="41" width="44" height="20" rx="3" {...WINDOW_STYLE}/>
        {/* Платформа */}
        <polygon points="10,66 126,66 110,40 10,40" fill="#43A047"/>
        <line x1="12" y1="46" x2="122" y2="46" stroke="#1B5E20" strokeWidth="3"/>
        <line x1="12" y1="58" x2="122" y2="58" stroke="#1B5E20" strokeWidth="3"/>
        {/* Кран */}
        <rect x="8" y="28" width="12" height="16" rx="3" fill="#1B5E20"/>
        <line x1="14" y1="28" x2="50" y2="10" stroke="#2E7D32" strokeWidth="7" strokeLinecap="round"/>
        <line x1="50" y1="10" x2="48" y2="34" stroke="#888" strokeWidth="2" strokeDasharray="4,3"/>
        <path d="M44,34 Q42,42 48,42 Q54,42 52,34" fill="none" stroke="#555" strokeWidth="2.5"/>
        <W cx={42}/><W cx={80}/><W cx={152}/><W cx={175}/>
      </svg>
    ),
    /* ---- МУСОРНАЯ МАШИНА ---- */
    "Мусорная машина": (
      <svg width={w} height={h} viewBox={vb}>
        <rect x="8" y="62" width="184" height="24" rx="6" fill="#1B5E20"/>
        <rect x="128" y="32" width="60" height="32" rx="7" fill="#2E7D32"/>
        <rect x="136" y="37" width="44" height="22" rx="3" {...WINDOW_STYLE}/>
        {/* Контейнер */}
        <rect x="10" y="30" width="112" height="36" rx="6" fill="#388E3C"/>
        <rect x="6"  y="28" width="10" height="40" rx="4" fill="#1B5E20"/>
        <line x1="10" y1="46" x2="120" y2="46" stroke="#1B5E20" strokeWidth="3"/>
        {[20,44,68,92].map(x => <rect key={x} x={x} y="32" width="18" height="12" rx="2" fill="#1B5E20"/>)}
        <W cx={42}/><W cx={80}/><W cx={152}/><W cx={175}/>
      </svg>
    ),
    /* ---- БЕНЗОВОЗ ---- */
    "Бензовоз": (
      <svg width={w} height={h} viewBox={vb}>
        <rect x="8" y="72" width="184" height="18" rx="5" fill="#E65100"/>
        <rect x="136" y="38" width="58" height="36" rx="7" fill="#BF360C"/>
        <rect x="144" y="43" width="42" height="24" rx="3" {...WINDOW_STYLE}/>
        {/* Цистерна овальная */}
        <ellipse cx="66" cy="62" rx="62" ry="26" fill="#FF6D00"/>
        <ellipse cx="66" cy="62" rx="52" ry="19" fill="#FF8F00"/>
        {[22,54,86,116].map(x => <line key={x} x1={x} y1="37" x2={x} y2="87" stroke="#E65100" strokeWidth="3"/>)}
        <rect x="8" y="65" width="10" height="12" rx="2" fill="#BF360C"/>
        <W cx={38}/><W cx={74}/><W cx={152}/><W cx={175}/>
      </svg>
    ),
  };

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
      {shapes[name] || <span style={{ fontSize: size * 0.5 }}>🚗</span>}
    </div>
  );
};

// ============================================================
// ДАННЫЕ: цвета
// ============================================================
const COLOR_SETS = {
  basic: [
    { name: "Красный",    css: "#E53935" },
    { name: "Жёлтый",    css: "#FDD835" },
    { name: "Зелёный",   css: "#43A047" },
    { name: "Синий",     css: "#1E88E5" },
  ],
  extended: [
    { name: "Красный",    css: "#E53935" },
    { name: "Жёлтый",    css: "#FDD835" },
    { name: "Зелёный",   css: "#43A047" },
    { name: "Синий",     css: "#1E88E5" },
    { name: "Оранжевый", css: "#FB8C00" },
    { name: "Фиолетовый",css: "#8E24AA" },
    { name: "Розовый",   css: "#EC407A" },
    { name: "Белый",     css: "#F5F5F5" },
    { name: "Чёрный",    css: "#212121" },
  ],
  all: [
    { name: "Красный",    css: "#E53935" },
    { name: "Жёлтый",    css: "#FDD835" },
    { name: "Зелёный",   css: "#43A047" },
    { name: "Синий",     css: "#1E88E5" },
    { name: "Оранжевый", css: "#FB8C00" },
    { name: "Фиолетовый",css: "#8E24AA" },
    { name: "Розовый",   css: "#EC407A" },
    { name: "Белый",     css: "#F5F5F5" },
    { name: "Чёрный",    css: "#212121" },
    { name: "Голубой",   css: "#29B6F6" },
    { name: "Салатовый", css: "#9CCC65" },
    { name: "Коричневый",css: "#6D4C41" },
    { name: "Серый",     css: "#757575" },
  ],
};

// ============================================================
// ДАННЫЕ: фигуры (SVG inline)
// ============================================================
const SHAPE_SETS = {
  simple: [
    { name: "Круг" },
    { name: "Квадрат" },
    { name: "Треугольник" },
    { name: "Овал" },
  ],
  medium: [
    { name: "Круг" }, { name: "Квадрат" }, { name: "Треугольник" }, { name: "Овал" },
    { name: "Прямоугольник" }, { name: "Ромб" }, { name: "Трапеция" },
    { name: "Звезда" }, { name: "Полукруг" }, { name: "Сердце" },
  ],
  all: [
    { name: "Круг" }, { name: "Квадрат" }, { name: "Треугольник" }, { name: "Овал" },
    { name: "Прямоугольник" }, { name: "Ромб" }, { name: "Трапеция" },
    { name: "Звезда" }, { name: "Полукруг" }, { name: "Сердце" },
    { name: "Пятиугольник" }, { name: "Шестиугольник" },
    { name: "Куб" }, { name: "Шар" }, { name: "Конус" }, { name: "Цилиндр" },
  ],
};

const SHAPE_COLOR = "#4ECDC4";
const ShapeSVG = ({ name, size = 130 }) => {
  const c = SHAPE_COLOR;
  const s = size; const h = size;
  const vb = "0 0 100 100";
  const shapes = {
    "Круг":         <circle cx="50" cy="50" r="42" fill={c}/>,
    "Квадрат":      <rect x="8" y="8" width="84" height="84" rx="4" fill={c}/>,
    "Треугольник":  <polygon points="50,6 94,92 6,92" fill={c}/>,
    "Овал":         <ellipse cx="50" cy="50" rx="46" ry="30" fill={c}/>,
    "Прямоугольник":<rect x="4" y="24" width="92" height="52" rx="4" fill={c}/>,
    "Ромб":         <polygon points="50,6 92,50 50,94 8,50" fill={c}/>,
    "Трапеция":     <polygon points="20,80 80,80 92,20 8,20" fill={c}/>,
    "Звезда":       <polygon points="50,4 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={c}/>,
    "Полукруг":     <path d="M8,60 A42,42 0 0 1 92,60 Z" fill={c}/>,
    "Сердце":       <path d="M50,82 C20,62 6,46 6,32 A22,22 0 0 1 50,18 A22,22 0 0 1 94,32 C94,46 80,62 50,82Z" fill={c}/>,
    "Пятиугольник": <polygon points="50,6 94,38 76,90 24,90 6,38" fill={c}/>,
    "Шестиугольник":<polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill={c}/>,
    "Куб":          <>
                      <polygon points="20,30 70,10 70,60 20,80" fill={c}/>
                      <polygon points="70,10 94,22 94,72 70,60" fill={SHAPE_COLOR+"BB"}/>
                      <polygon points="20,80 70,60 94,72 44,92" fill={SHAPE_COLOR+"77"}/>
                    </>,
    "Шар":          <>
                      <circle cx="50" cy="50" r="42" fill={c}/>
                      <ellipse cx="40" cy="36" rx="14" ry="8" fill="rgba(255,255,255,0.3)" transform="rotate(-30,40,36)"/>
                    </>,
    "Конус":        <>
                      <polygon points="50,6 90,88 10,88" fill={c}/>
                      <ellipse cx="50" cy="88" rx="40" ry="10" fill={SHAPE_COLOR+"99"}/>
                    </>,
    "Цилиндр":      <>
                      <rect x="16" y="30" width="68" height="56" fill={c}/>
                      <ellipse cx="50" cy="30" rx="34" ry="10" fill={SHAPE_COLOR+"CC"}/>
                      <ellipse cx="50" cy="86" rx="34" ry="10" fill={SHAPE_COLOR+"88"}/>
                    </>,
  };
  return (
    <svg width={s} height={h} viewBox={vb} xmlns="http://www.w3.org/2000/svg">
      {shapes[name] || <circle cx="50" cy="50" r="40" fill={c}/>}
    </svg>
  );
};

// ============================================================
// ДАННЫЕ: цифры
// ============================================================
const NUMBER_RANGES = {
  "1-3": [1,2,3],
  "1-5": [1,2,3,4,5],
  "1-9": [1,2,3,4,5,6,7,8,9],
};
const NUMBER_WORDS = {
  1:"один",2:"два",3:"три",4:"четыре",5:"пять",
  6:"шесть",7:"семь",8:"восемь",9:"девять",
};

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================
function randomItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function randomItemExceptName(arr, excludeName) {
  const f = arr.filter(x=>x.name!==excludeName);
  return f.length ? randomItem(f) : arr[0];
}
function randomItemExcept(arr, exclude) {
  const f = arr.filter(x=>x!==exclude);
  return f.length ? randomItem(f) : arr[0];
}
function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

// ============================================================
// ОЗВУЧКА
// ============================================================
function speak(text, onEnd) {
  if (!window.speechSynthesis) { if(onEnd)onEnd(); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ru-RU"; u.rate = 0.8;
  const voices = window.speechSynthesis.getVoices();
  const rv = voices.find(v=>v.lang.startsWith("ru"));
  if(rv) u.voice = rv;
  if(onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}
function speakSequence(intro, main) {
  speak(intro, ()=>setTimeout(()=>speak(main),300));
}

// ============================================================
// ЗВУКИ
// ============================================================
function playSuccess() {
  try {
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.frequency.setValueAtTime(523,ctx.currentTime);
    o.frequency.setValueAtTime(659,ctx.currentTime+0.15);
    o.frequency.setValueAtTime(784,ctx.currentTime+0.3);
    g.gain.setValueAtTime(0.3,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.6);
    o.start(ctx.currentTime);o.stop(ctx.currentTime+0.6);
  }catch(e){}
}
function playError() {
  try {
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.type="sawtooth";o.frequency.setValueAtTime(200,ctx.currentTime);
    g.gain.setValueAtTime(0.2,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4);
    o.start(ctx.currentTime);o.stop(ctx.currentTime+0.4);
  }catch(e){}
}

// ============================================================
// ГЛОБАЛЬНЫЕ СТИЛИ
// ============================================================
const GLOBAL_STYLES = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#FFF9F0;--primary:#FF6B35;--primary-d:#E55A26;
    --accent:#4ECDC4;--accent-d:#3DB8B0;--text:#2D2D2D;--muted:#888;
    --green:#5CB85C;--red:#D9534F;--radius:24px;--shadow:0 4px 16px rgba(0,0,0,0.10);
  }
  html,body,#root{height:100%;width:100%;background:var(--bg);
    font-family:'Nunito','Segoe UI',Arial,sans-serif;color:var(--text);
    -webkit-tap-highlight-color:transparent;user-select:none;}
  body{overflow:hidden;touch-action:manipulation;}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
    padding:16px 28px;border:none;border-radius:var(--radius);
    font-size:clamp(1rem,3vw,1.3rem);font-weight:700;cursor:pointer;
    transition:transform 0.15s;line-height:1.2;text-align:center;}
  .btn:active{transform:scale(0.93);}
  .btn-primary{background:var(--primary);color:#fff;box-shadow:0 4px 0 var(--primary-d);}
  .btn-ghost{background:#fff;color:var(--text);border:2px solid #E0E0E0;box-shadow:var(--shadow);}
  .btn-ghost:active{background:#F5F5F5;}
  .btn-back{background:#fff;color:var(--muted);border:2px solid #E0E0E0;
    padding:10px 20px;font-size:clamp(0.9rem,2.5vw,1.1rem);box-shadow:none;}
  .screen{display:flex;flex-direction:column;align-items:center;
    height:100dvh;width:100%;padding:clamp(12px,3vw,24px) clamp(12px,4vw,20px);
    overflow-y:auto;gap:clamp(8px,2vw,16px);}
  .pressable{transition:transform 0.15s;}
  .pressable:active{transform:scale(0.93);}
`;

// ============================================================
// ПЕРЕИСПОЛЬЗУЕМЫЕ КОМПОНЕНТЫ
// ============================================================

// Стандартная шапка игрового экрана
function GameHeader({ onBack, label, record, streak }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:560}}>
      <button className="btn btn-back" onClick={onBack}>← Назад</button>
      {label && <div style={{fontSize:"0.9rem",color:"var(--muted)",fontWeight:600}}>{label}</div>}
      <div style={{fontWeight:800,fontSize:"clamp(1rem,3vw,1.2rem)",color:"var(--muted)"}}>
        🏆{record} 🔥{streak}
      </div>
    </div>
  );
}

// Заголовок + подзаголовок игрового раунда
function RoundTitle({ title, subtitle }) {
  return (
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:"clamp(1.2rem,4vw,1.6rem)",fontWeight:700,color:"var(--muted)"}}>{title}</div>
      {subtitle && (
        <div style={{fontSize:"clamp(1.6rem,6vw,2.4rem)",fontWeight:900,color:"var(--text)",marginTop:4}}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

// Стиль опции выбора в настройках
function settingsOptStyle(active, color="var(--primary)") {
  return {
    padding:"14px 18px",borderRadius:16,
    border:`3px solid ${active?color:"#E0E0E0"}`,
    background:active?color:"#fff",
    color:active?"#fff":"var(--text)",
    fontWeight:700,fontSize:"clamp(0.95rem,3vw,1.15rem)",cursor:"pointer",
    flex:1,textAlign:"center",transition:"all 0.15s",
  };
}

// Панель кнопок нижней части игры
function BottomBar({ children, maxWidth=540 }) {
  return (
    <div style={{display:"flex",gap:12,width:"100%",maxWidth}}>
      {children}
    </div>
  );
}

// ============================================================
// ГЛАВНЫЙ ЭКРАН
// ============================================================
function MenuScreen({ onSelect }) {
  const rubrics = [
    { id:"animals",  emoji:"🐶", label:"Животные",  color:"#4ECDC4" },
    { id:"vehicles", emoji:"🚗", label:"Машинки",   color:"#FF8F00" },
    { id:"numbers",  emoji:"🔢", label:"Цифры",     color:"#FF6B35" },
    { id:"colors",   emoji:"🎨", label:"Цвета",     color:"#8E24AA" },
    { id:"shapes",   emoji:"🔷", label:"Фигуры",    color:"#00ACC1" },
  ];
  return (
    <div className="screen" style={{justifyContent:"center",gap:clamp(16,24)}}>
      <div style={{textAlign:"center",marginBottom:4}}>
        <div style={{fontSize:"clamp(2rem,8vw,3rem)"}}>🌟</div>
        <h1 style={{fontSize:"clamp(1.8rem,7vw,2.6rem)",fontWeight:900,color:"var(--primary)",letterSpacing:"-1px"}}>
          Развивашки
        </h1>
        <p style={{color:"var(--muted)",fontSize:"clamp(0.9rem,3vw,1.1rem)",marginTop:4}}>Выбери игру</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(12px,2.5vw,18px)",width:"100%",maxWidth:440}}>
        {rubrics.map(r=>(
          <button key={r.id} className="pressable" onClick={()=>onSelect(r.id)} style={{
            display:"flex",alignItems:"center",gap:18,
            padding:"clamp(16px,3vw,24px) clamp(20px,5vw,32px)",
            background:"#fff",border:`3px solid ${r.color}`,
            borderRadius:"var(--radius)",boxShadow:`0 6px 0 ${r.color}55`,
            cursor:"pointer",width:"100%",
          }}>
            <span style={{fontSize:"clamp(2rem,6vw,2.6rem)"}}>{r.emoji}</span>
            <span style={{fontSize:"clamp(1.3rem,5vw,1.8rem)",fontWeight:800}}>{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function clamp(a,b){ return `clamp(${a}px,3vw,${b}px)`; }

// ============================================================
// ОБЩИЙ ШАБЛОН ЭКРАНА НАСТРОЕК
// ============================================================
function SettingsScreen({ emoji, title, sections, onStart, onBack }) {
  return (
    <div className="screen" style={{gap:"clamp(14px,3vw,24px)"}}>
      <div style={{width:"100%",maxWidth:500}}>
        <button className="btn btn-back" onClick={onBack}>← Назад</button>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"clamp(2rem,7vw,3rem)"}}>{emoji}</div>
        <h2 style={{fontSize:"clamp(1.5rem,6vw,2rem)",fontWeight:900}}>{title}</h2>
      </div>
      {sections.map((sec,i)=>(
        <div key={i} style={{width:"100%",maxWidth:500}}>
          <p style={{fontWeight:700,fontSize:"clamp(0.95rem,3vw,1.2rem)",marginBottom:10,color:"var(--muted)"}}>
            {sec.label}
          </p>
          <div style={{display:"flex",flexDirection:sec.column?"column":"row",gap:10}}>
            {sec.options.map(opt=>(
              <button key={opt.id} onClick={()=>sec.onChange(opt.id)}
                style={{
                  ...settingsOptStyle(sec.value===opt.id, sec.color||"var(--primary)"),
                  ...(sec.column?{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2}:{})
                }}>
                <span>{opt.label}</span>
                {opt.desc && <span style={{fontWeight:400,fontSize:"0.9rem",opacity:0.85}}>{opt.desc}</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-primary"
        style={{width:"100%",maxWidth:500,fontSize:"clamp(1.2rem,4vw,1.6rem)",padding:"clamp(16px,3vw,22px)"}}
        onClick={onStart}>
        Начать 🚀
      </button>
    </div>
  );
}

// ============================================================
// НАСТРОЙКИ: ЖИВОТНЫЕ
// ============================================================
function SettingsAnimalsScreen({ settings, onChangeSettings, onStart, onBack }) {
  return (
    <SettingsScreen emoji="🐶" title="Животные" onStart={onStart} onBack={onBack}
      sections={[
        {
          label:"Набор животных", column:false, color:"var(--accent)",
          value: settings.set,
          onChange: v => onChangeSettings({...settings, set:v}),
          options:[
            {id:"domestic",  label:"🏠 Домашние"},
            {id:"wild",      label:"🌿 Дикие"},
            {id:"all",       label:"🌍 Все"},
          ],
        },
        {
          label:"Уровень обучения", column:true,
          value: settings.level,
          onChange: v => onChangeSettings({...settings, level:v}),
          options:[
            {id:1, label:"Уровень 1. Повторение",  desc:"Повтори за мной"},
            {id:2, label:"Уровень 2. Узнавание",   desc:"Выбери правильный ответ"},
          ],
        },
      ]}
    />
  );
}

// ============================================================
// НАСТРОЙКИ: МАШИНКИ
// ============================================================
function SettingsVehiclesScreen({ settings, onChangeSettings, onStart, onBack }) {
  return (
    <SettingsScreen emoji="🚗" title="Машинки" onStart={onStart} onBack={onBack}
      sections={[
        {
          label:"Набор машин", column:false, color:"var(--accent)",
          value: settings.set,
          onChange: v => onChangeSettings({...settings, set:v}),
          options:[
            {id:"everyday",     label:"🚗 Транспорт"},
            {id:"construction", label:"🚜 Стройка"},
            {id:"special",      label:"🚒 Спецтехника"},
          ],
        },
        {
          label:"Уровень обучения", column:true,
          value: settings.level,
          onChange: v => onChangeSettings({...settings, level:v}),
          options:[
            {id:1, label:"Уровень 1. Повторение",  desc:"Повтори за мной"},
            {id:2, label:"Уровень 2. Узнавание",   desc:"Выбери правильный ответ"},
          ],
        },
      ]}
    />
  );
}

// ============================================================
// НАСТРОЙКИ: ЦИФРЫ
// ============================================================
function SettingsNumbersScreen({ settings, onChangeSettings, onStart, onBack }) {
  return (
    <SettingsScreen emoji="🔢" title="Цифры" onStart={onStart} onBack={onBack}
      sections={[
        {
          label:"Диапазон цифр", column:false, color:"var(--accent)",
          value: settings.range,
          onChange: v => onChangeSettings({...settings, range:v}),
          options:[{id:"1-3",label:"1–3"},{id:"1-5",label:"1–5"},{id:"1-9",label:"1–9"}],
        },
        {
          label:"Уровень обучения", column:true,
          value: settings.level,
          onChange: v => onChangeSettings({...settings, level:v}),
          options:[
            {id:1, label:"Уровень 1. Повторение",  desc:"Повтори за мной"},
            {id:2, label:"Уровень 2. Узнавание",   desc:"Выбери правильный ответ"},
          ],
        },
      ]}
    />
  );
}

// ============================================================
// НАСТРОЙКИ: ЦВЕТА
// ============================================================
function SettingsColorsScreen({ settings, onChangeSettings, onStart, onBack }) {
  return (
    <SettingsScreen emoji="🎨" title="Цвета" onStart={onStart} onBack={onBack}
      sections={[
        {
          label:"Количество цветов", column:true, color:"var(--accent)",
          value: settings.set,
          onChange: v => onChangeSettings({...settings, set:v}),
          options:[
            {id:"basic",    label:"Базовые",                  desc:"4 цвета"},
            {id:"extended", label:"Базовые + Дополнительные", desc:"9 цветов"},
            {id:"all",      label:"Все цвета",                desc:"13 цветов"},
          ],
        },
        {
          label:"Уровень обучения", column:true,
          value: settings.level,
          onChange: v => onChangeSettings({...settings, level:v}),
          options:[
            {id:1, label:"Уровень 1. Повторение",  desc:"Повтори за мной"},
            {id:2, label:"Уровень 2. Узнавание",   desc:"Выбери правильный ответ"},
          ],
        },
      ]}
    />
  );
}

// ============================================================
// НАСТРОЙКИ: ФИГУРЫ
// ============================================================
function SettingsShapesScreen({ settings, onChangeSettings, onStart, onBack }) {
  return (
    <SettingsScreen emoji="🔷" title="Фигуры" onStart={onStart} onBack={onBack}
      sections={[
        {
          label:"Набор фигур", column:true, color:"var(--accent)",
          value: settings.set,
          onChange: v => onChangeSettings({...settings, set:v}),
          options:[
            {id:"simple", label:"Простые",               desc:"4 фигуры"},
            {id:"medium", label:"Простые + Составные",   desc:"10 фигур"},
            {id:"all",    label:"Все фигуры",             desc:"16 фигур"},
          ],
        },
        {
          label:"Уровень обучения", column:true,
          value: settings.level,
          onChange: v => onChangeSettings({...settings, level:v}),
          options:[
            {id:1, label:"Уровень 1. Повторение",  desc:"Повтори за мной"},
            {id:2, label:"Уровень 2. Узнавание",   desc:"Выбери правильный ответ"},
          ],
        },
      ]}
    />
  );
}

// ============================================================
// ОБЩАЯ ЛОГИКА: хук useLearnGame (уровень Повторение)
// ============================================================
function useLearnGame({ items, getKey, record, onUpdateRecord, introText }) {
  const [current, setCurrent] = useState(()=>randomItem(items));
  const introRef = useRef(false);
  const [score,  setScore]  = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(()=>{
    const t = setTimeout(()=>{
      const name = getKey(current);
      if(!introRef.current){ introRef.current=true; speakSequence(introText, name); }
      else { speak(name); }
    },400);
    return ()=>clearTimeout(t);
  },[current]);

  function handleRepeat() { speak(getKey(current)); }
  function handleNext() {
    const next = randomItemExceptName(items, getKey(current)===(current.name||current) ? current.name : current);
    const ns=score+1, nst=streak+1;
    setScore(ns); setStreak(nst);
    if(ns>record) onUpdateRecord(ns);
    setCurrent(next);
  }
  return { current, score, streak, handleRepeat, handleNext };
}

// ============================================================
// ОБЩАЯ ЛОГИКА: хук useQuizGame (уровень Узнавание)
// ============================================================
function useQuizGame({ items, getKey, record, onUpdateRecord, introText, optCount=3 }) {
  function generateQuestion(excludeKey=null) {
    const correct = excludeKey ? randomItemExceptName(items, excludeKey) : randomItem(items);
    const cnt = Math.min(optCount, items.length);
    const pool = shuffle(items.filter(x=>getKey(x)!==getKey(correct)));
    const opts = shuffle([correct, ...pool.slice(0,cnt-1)]);
    return { correct, options: opts };
  }
  const [question, setQuestion]       = useState(()=>generateQuestion());
  const [answerState, setAnswerState] = useState(null);
  const [chosen, setChosen]           = useState(null);
  const [score,  setScore]            = useState(0);
  const [streak, setStreak]           = useState(0);
  const introRef                      = useRef(false);

  useEffect(()=>{
    const t = setTimeout(()=>{
      const name = getKey(question.correct);
      if(!introRef.current){ introRef.current=true; speakSequence(introText, name); }
      else { speak(name); }
    },400);
    return ()=>clearTimeout(t);
  },[question]);

  function handleAnswer(item) {
    if(answerState!==null) return;
    const key = getKey(item);
    setChosen(key);
    if(key===getKey(question.correct)){
      playSuccess(); setAnswerState("correct");
      const ns=score+1, nst=streak+1; setScore(ns); setStreak(nst);
      if(ns>record) onUpdateRecord(ns);
      setTimeout(()=>{ setAnswerState(null); setChosen(null); setQuestion(generateQuestion(getKey(question.correct))); },700);
    } else {
      playError(); setAnswerState("wrong"); setStreak(0);
      setTimeout(()=>{ setAnswerState(null); setChosen(null); },700);
    }
  }
  function handleRepeat() { speak(getKey(question.correct)); }

  return { question, answerState, chosen, score, streak, handleAnswer, handleRepeat };
}

// ============================================================
// ИГРА: ЖИВОТНЫЕ — Уровень 1
// ============================================================
function GameAnimalsLearnScreen({ animalSet, record, onUpdateRecord, onBack }) {
  const items = ANIMAL_SETS[animalSet];
  const { current, streak, handleRepeat, handleNext } = useLearnGame({
    items, getKey:x=>x.name, record, onUpdateRecord, introText:"Назови животное",
  });
  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} record={record} streak={streak}/>
      <RoundTitle title="Назови животное" subtitle={current.name}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <button className="pressable" onClick={()=>playAnimalSound(current)}
          style={{background:"none",border:"none",cursor:"pointer",lineHeight:1}}>
          <span style={{fontSize:"clamp(5rem,22vw,9rem)"}}>{current.emoji}</span>
        </button>
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{flex:1}} onClick={handleNext}>Следующий ➡️</button>
      </BottomBar>
    </div>
  );
}

// ============================================================
// ИГРА: ЖИВОТНЫЕ — Уровень 2
// ============================================================
function GameAnimalsQuizScreen({ animalSet, record, onUpdateRecord, onBack }) {
  const items = ANIMAL_SETS[animalSet];
  const { question, answerState, chosen, streak, handleAnswer, handleRepeat } =
    useQuizGame({ items, getKey:x=>x.name, record, onUpdateRecord, introText:"Выбери правильное животное" });

  function cardBorder(item) {
    if(chosen!==item.name) return "3px solid transparent";
    return answerState==="correct" ? "3px solid var(--green)" : "3px solid var(--red)";
  }

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} record={record} streak={streak}/>
      <RoundTitle title="Выбери правильное животное" subtitle={question.correct.name}/>
      <div style={{flex:1,display:"flex",gap:"clamp(10px,3vw,20px)",width:"100%",maxWidth:560,alignItems:"center",justifyContent:"center"}}>
        {question.options.map(item=>(
          <button key={item.name} className="pressable" onClick={()=>{ handleAnswer(item); playAnimalSound(item); }}
            style={{
              flex:1,aspectRatio:"1/1",background:"var(--accent)",border:cardBorder(item),
              borderRadius:20,display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",gap:6,
              cursor:"pointer",boxShadow:"0 6px 0 rgba(0,0,0,0.12)",
              transform: chosen===item.name ? "scale(0.93)" : "scale(1)",
            }}>
            <span style={{fontSize:"clamp(2rem,9vw,4rem)"}}>{item.emoji}</span>
            <span style={{fontSize:"clamp(0.75rem,2.5vw,1.1rem)",fontWeight:700,color:"#fff",textAlign:"center"}}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
      </BottomBar>
    </div>
  );
}

// ============================================================
// ИГРА: МАШИНКИ — Уровень 1
// ============================================================
function GameVehiclesLearnScreen({ vehicleSet, record, onUpdateRecord, onBack }) {
  const items = VEHICLE_SETS[vehicleSet];
  const { current, streak, handleRepeat, handleNext } = useLearnGame({
    items, getKey:x=>x.name, record, onUpdateRecord, introText:"Назови машину",
  });
  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} record={record} streak={streak}/>
      <RoundTitle title="Назови машину" subtitle={current.name}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div className="pressable" style={{cursor:"pointer"}} onClick={()=>speak(current.name)}>
          <VehicleSVG name={current.name} size={Math.min(window.innerWidth*0.7, 240)}/>
        </div>
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{flex:1}} onClick={handleNext}>Следующий ➡️</button>
      </BottomBar>
    </div>
  );
}

// ============================================================
// ИГРА: МАШИНКИ — Уровень 2
// ============================================================
function GameVehiclesQuizScreen({ vehicleSet, record, onUpdateRecord, onBack }) {
  const items = VEHICLE_SETS[vehicleSet];
  const { question, answerState, chosen, streak, handleAnswer, handleRepeat } =
    useQuizGame({ items, getKey:x=>x.name, record, onUpdateRecord, introText:"Выбери правильную машину" });

  function cardBorder(item) {
    if(chosen!==item.name) return "3px solid transparent";
    return answerState==="correct" ? "3px solid var(--green)" : "3px solid var(--red)";
  }

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} record={record} streak={streak}/>
      <RoundTitle title="Выбери правильную машину" subtitle={question.correct.name}/>
      <div style={{flex:1,display:"flex",gap:"clamp(8px,2vw,14px)",width:"100%",maxWidth:580,alignItems:"center",justifyContent:"center"}}>
        {question.options.map(item=>(
          <button key={item.name} className="pressable" onClick={()=>handleAnswer(item)}
            style={{
              flex:1,aspectRatio:"1/1",background:"#fff",border:cardBorder(item),
              borderRadius:20,display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",gap:6,
              cursor:"pointer",boxShadow:"0 6px 0 rgba(0,0,0,0.12)",
              padding:"6px",
              transform: chosen===item.name ? "scale(0.93)" : "scale(1)",
              transition:"transform 0.15s, border 0.15s",
            }}>
            <VehicleSVG name={item.name} size={Math.min(window.innerWidth*0.22, 100)}/>
            <span style={{fontSize:"clamp(0.65rem,2vw,0.95rem)",fontWeight:700,color:"var(--text)",textAlign:"center",lineHeight:1.2}}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
      </BottomBar>
    </div>
  );
}

// ============================================================
// ИГРА: ЦИФРЫ — Уровень 1
// ============================================================
function GameNumbersLearnScreen({ range, record, onUpdateRecord, onBack }) {
  const numbers = NUMBER_RANGES[range];
  const [current, setCurrent] = useState(()=>randomItem(numbers));
  const introRef = useRef(false);
  const [score,setScore]=useState(0); const [streak,setStreak]=useState(0);

  useEffect(()=>{
    const t=setTimeout(()=>{
      if(!introRef.current){ introRef.current=true; speakSequence("Назови цифру", NUMBER_WORDS[current]); }
      else { speak(NUMBER_WORDS[current]); }
    },400);
    return ()=>clearTimeout(t);
  },[current]);

  function handleRepeat(){ speak(NUMBER_WORDS[current]); }
  function handleNext(){
    const next=randomItemExcept(numbers,current);
    const ns=score+1,nst=streak+1; setScore(ns); setStreak(nst);
    if(ns>record) onUpdateRecord(ns);
    setCurrent(next);
  }

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} label={`${range}`} record={record} streak={streak}/>
      <RoundTitle title="Назови цифру" subtitle={NUMBER_WORDS[current]}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{fontSize:"clamp(6rem,32vw,12rem)",fontWeight:900,color:"var(--primary)",lineHeight:1,textShadow:"0 6px 0 #E55A2655"}}>
          {current}
        </div>
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{flex:1}} onClick={handleNext}>Следующая ➡️</button>
      </BottomBar>
    </div>
  );
}

// ============================================================
// ИГРА: ЦИФРЫ — Уровень 2
// ============================================================
function GameNumbersQuizScreen({ range, record, onUpdateRecord, onBack }) {
  const numbers = NUMBER_RANGES[range];
  function genQ(excl=null){
    const correct=excl!==null?randomItemExcept(numbers,excl):randomItem(numbers);
    const cnt=Math.min(3,numbers.length);
    const pool=shuffle(numbers.filter(n=>n!==correct));
    return { correct, options:shuffle([correct,...pool.slice(0,cnt-1)]) };
  }
  const [question,setQuestion]=useState(()=>genQ());
  const [answerState,setAnswerState]=useState(null);
  const [chosen,setChosen]=useState(null);
  const [score,setScore]=useState(0); const [streak,setStreak]=useState(0);
  const introRef=useRef(false);

  useEffect(()=>{
    const t=setTimeout(()=>{
      if(!introRef.current){ introRef.current=true; speakSequence("Выбери цифру", NUMBER_WORDS[question.correct]); }
      else { speak(NUMBER_WORDS[question.correct]); }
    },400);
    return ()=>clearTimeout(t);
  },[question]);

  function handleAnswer(num){
    if(answerState!==null) return;
    setChosen(num);
    if(num===question.correct){
      playSuccess(); setAnswerState("correct");
      const ns=score+1,nst=streak+1; setScore(ns); setStreak(nst);
      if(ns>record) onUpdateRecord(ns);
      setTimeout(()=>{ setAnswerState(null); setChosen(null); setQuestion(genQ(question.correct)); },700);
    } else {
      playError(); setAnswerState("wrong"); setStreak(0);
      setTimeout(()=>{ setAnswerState(null); setChosen(null); },700);
    }
  }
  function optBg(num){
    if(chosen===num) return answerState==="correct"?"var(--green)":"var(--red)";
    return "var(--primary)";
  }

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} label={range} record={record} streak={streak}/>
      <RoundTitle title="Выбери цифру" subtitle={NUMBER_WORDS[question.correct]}/>
      <div style={{flex:1,display:"flex",gap:"clamp(12px,3vw,20px)",width:"100%",maxWidth:500,alignItems:"center",justifyContent:"center"}}>
        {question.options.map(num=>(
          <button key={num} className="pressable" onClick={()=>handleAnswer(num)} style={{
            flex:1,aspectRatio:"1/1",background:optBg(num),color:"#fff",border:"none",
            borderRadius:24,fontSize:"clamp(2.5rem,12vw,5rem)",fontWeight:900,
            cursor:"pointer",boxShadow:"0 6px 0 rgba(0,0,0,0.15)",
            transform:chosen===num?"scale(0.93)":"scale(1)",
            transition:"transform 0.15s,background 0.2s",
          }}>{num}</button>
        ))}
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={()=>speak(NUMBER_WORDS[question.correct])}>🔊 Повторить</button>
      </BottomBar>
    </div>
  );
}

// ============================================================
// ИГРА: ЦВЕТА — Уровень 1
// ============================================================
function GameColorsLearnScreen({ colorSet, record, onUpdateRecord, onBack }) {
  const colors = COLOR_SETS[colorSet];
  const { current, streak, handleRepeat, handleNext } = useLearnGame({
    items:colors, getKey:x=>x.name, record, onUpdateRecord, introText:"Назови цвет",
  });
  const isLight = current.css==="#F5F5F5";
  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} record={record} streak={streak}/>
      <RoundTitle title="Назови цвет" subtitle={current.name}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div className="pressable" onClick={handleRepeat} style={{
          width:"clamp(140px,40vw,240px)",height:"clamp(140px,40vw,240px)",
          borderRadius:"50%",background:current.css,cursor:"pointer",
          border:isLight?"4px solid #CCC":"4px solid rgba(0,0,0,0.08)",
          boxShadow:"0 8px 32px rgba(0,0,0,0.18)",transition:"background 0.3s",
        }}/>
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{flex:1}} onClick={handleNext}>Следующий ➡️</button>
      </BottomBar>
    </div>
  );
}

// ============================================================
// ИГРА: ЦВЕТА — Уровень 2
// ============================================================
function GameColorsQuizScreen({ colorSet, record, onUpdateRecord, onBack }) {
  const colors = COLOR_SETS[colorSet];
  const { question, chosen, answerState, streak, handleAnswer, handleRepeat } =
    useQuizGame({ items:colors, getKey:x=>x.name, record, onUpdateRecord, introText:"Выбери правильный цвет" });

  const isLight = c => c.css==="#F5F5F5";

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} record={record} streak={streak}/>
      <RoundTitle title="Выбери правильный цвет" subtitle={question.correct.name}/>
      <div style={{flex:1,display:"flex",gap:"clamp(14px,4vw,28px)",width:"100%",maxWidth:540,alignItems:"center",justifyContent:"center"}}>
        {question.options.map(color=>(
          <button key={color.name} className="pressable" onClick={()=>handleAnswer(color)} style={{
            flex:1,aspectRatio:"1/1",borderRadius:"50%",background:color.css,
            border:isLight(color)?"4px solid #CCC":"4px solid rgba(0,0,0,0.08)",
            cursor:"pointer",boxShadow:"0 6px 20px rgba(0,0,0,0.15)",
            transform:chosen===color.name?"scale(0.93)":"scale(1)",
            transition:"transform 0.15s",
          }}/>
        ))}
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
      </BottomBar>
    </div>
  );
}

// ============================================================
// ИГРА: ФИГУРЫ — Уровень 1
// ============================================================
function GameShapesLearnScreen({ shapeSet, record, onUpdateRecord, onBack }) {
  const items = SHAPE_SETS[shapeSet];
  const { current, streak, handleRepeat, handleNext } = useLearnGame({
    items, getKey:x=>x.name, record, onUpdateRecord, introText:"Назови фигуру",
  });
  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} record={record} streak={streak}/>
      <RoundTitle title="Назови фигуру" subtitle={current.name}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div className="pressable" onClick={handleRepeat} style={{cursor:"pointer"}}>
          <ShapeSVG name={current.name} size={Math.min(window.innerWidth*0.55, 200)}/>
        </div>
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{flex:1}} onClick={handleNext}>Следующая ➡️</button>
      </BottomBar>
    </div>
  );
}

// ============================================================
// ИГРА: ФИГУРЫ — Уровень 2
// ============================================================
function GameShapesQuizScreen({ shapeSet, record, onUpdateRecord, onBack }) {
  const items = SHAPE_SETS[shapeSet];
  const { question, chosen, answerState, streak, handleAnswer, handleRepeat } =
    useQuizGame({ items, getKey:x=>x.name, record, onUpdateRecord, introText:"Выбери правильную фигуру" });

  function cardBorder(item) {
    if(chosen!==item.name) return "3px solid transparent";
    return answerState==="correct"?"3px solid var(--green)":"3px solid var(--red)";
  }

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} record={record} streak={streak}/>
      <RoundTitle title="Выбери правильную фигуру" subtitle={question.correct.name}/>
      <div style={{flex:1,display:"flex",gap:"clamp(10px,3vw,20px)",width:"100%",maxWidth:560,alignItems:"center",justifyContent:"center"}}>
        {question.options.map(item=>(
          <button key={item.name} className="pressable" onClick={()=>handleAnswer(item)}
            style={{
              flex:1,aspectRatio:"1/1",background:"#EEF9F9",border:cardBorder(item),
              borderRadius:20,display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",gap:6,
              cursor:"pointer",boxShadow:"0 6px 0 rgba(0,0,0,0.10)",
              transform:chosen===item.name?"scale(0.93)":"scale(1)",
              transition:"transform 0.15s, border 0.15s",
            }}>
            <ShapeSVG name={item.name} size={Math.min(window.innerWidth*0.2, 90)}/>
            <span style={{fontSize:"clamp(0.7rem,2.2vw,1rem)",fontWeight:700,color:"var(--text)",textAlign:"center"}}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
      </BottomBar>
    </div>
  );
}

// ============================================================
// КОРНЕВОЙ КОМПОНЕНТ: App
// ============================================================
export default function App() {
  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent=GLOBAL_STYLES;
    document.head.appendChild(style);
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap";
    document.head.appendChild(link);
    return ()=>{ document.head.removeChild(style); document.head.removeChild(link); };
  },[]);

  const [screen, setScreen] = useState("menu");
  const [rubric, setRubric] = useState(null);

  // Настройки каждой линейки
  const [animalsSettings,  setAnimalsSettings]  = useState({ set:"domestic", level:1 });
  const [vehiclesSettings, setVehiclesSettings] = useState({ set:"everyday", level:1 });
  const [numberSettings,   setNumberSettings]   = useState({ range:"1-5", level:1 });
  const [colorSettings,    setColorSettings]    = useState({ set:"basic", level:1 });
  const [shapesSettings,   setShapesSettings]   = useState({ set:"simple", level:1 });

  // Рекорды
  const [recAnimals,  setRecAnimals]  = useState(()=>parseInt(localStorage.getItem("rec_animals") ||"0",10));
  const [recVehicles, setRecVehicles] = useState(()=>parseInt(localStorage.getItem("rec_vehicles")||"0",10));
  const [recNumbers,  setRecNumbers]  = useState(()=>parseInt(localStorage.getItem("rec_numbers") ||"0",10));
  const [recColors,   setRecColors]   = useState(()=>parseInt(localStorage.getItem("rec_colors")  ||"0",10));
  const [recShapes,   setRecShapes]   = useState(()=>parseInt(localStorage.getItem("rec_shapes")  ||"0",10));

  function upRec(key, val, setter){ setter(val); localStorage.setItem(key,val); }

  const goMenu     = ()=>setScreen("menu");
  const goSettings = ()=>setScreen("settings");
  const goGame     = ()=>setScreen("game");

  function handleSelect(id){ setRubric(id); setScreen("settings"); }

  // ---- МЕНЮ ----
  if(screen==="menu") return <MenuScreen onSelect={handleSelect}/>;

  // ---- НАСТРОЙКИ ----
  if(screen==="settings"){
    if(rubric==="animals")  return <SettingsAnimalsScreen  settings={animalsSettings}  onChangeSettings={setAnimalsSettings}  onStart={goGame} onBack={goMenu}/>;
    if(rubric==="vehicles") return <SettingsVehiclesScreen settings={vehiclesSettings} onChangeSettings={setVehiclesSettings} onStart={goGame} onBack={goMenu}/>;
    if(rubric==="numbers")  return <SettingsNumbersScreen  settings={numberSettings}   onChangeSettings={setNumberSettings}   onStart={goGame} onBack={goMenu}/>;
    if(rubric==="colors")   return <SettingsColorsScreen   settings={colorSettings}    onChangeSettings={setColorSettings}    onStart={goGame} onBack={goMenu}/>;
    if(rubric==="shapes")   return <SettingsShapesScreen   settings={shapesSettings}   onChangeSettings={setShapesSettings}   onStart={goGame} onBack={goMenu}/>;
  }

  // ---- ИГРА ----
  if(screen==="game"){
    // ЖИВОТНЫЕ
    if(rubric==="animals"){
      if(animalsSettings.level===1)
        return <GameAnimalsLearnScreen key={`a-${animalsSettings.set}-1`} animalSet={animalsSettings.set} record={recAnimals} onUpdateRecord={v=>upRec("rec_animals",v,setRecAnimals)} onBack={goSettings}/>;
      if(animalsSettings.level===2)
        return <GameAnimalsQuizScreen  key={`a-${animalsSettings.set}-2`} animalSet={animalsSettings.set} record={recAnimals} onUpdateRecord={v=>upRec("rec_animals",v,setRecAnimals)} onBack={goSettings}/>;
    }
    // МАШИНКИ
    if(rubric==="vehicles"){
      if(vehiclesSettings.level===1)
        return <GameVehiclesLearnScreen key={`v-${vehiclesSettings.set}-1`} vehicleSet={vehiclesSettings.set} record={recVehicles} onUpdateRecord={v=>upRec("rec_vehicles",v,setRecVehicles)} onBack={goSettings}/>;
      if(vehiclesSettings.level===2)
        return <GameVehiclesQuizScreen  key={`v-${vehiclesSettings.set}-2`} vehicleSet={vehiclesSettings.set} record={recVehicles} onUpdateRecord={v=>upRec("rec_vehicles",v,setRecVehicles)} onBack={goSettings}/>;
    }
    // ЦИФРЫ
    if(rubric==="numbers"){
      const { range, level } = numberSettings;
      if(level===1)
        return <GameNumbersLearnScreen key={`n-${range}-1`} range={range} record={recNumbers} onUpdateRecord={v=>upRec("rec_numbers",v,setRecNumbers)} onBack={goSettings}/>;
      if(level===2)
        return <GameNumbersQuizScreen  key={`n-${range}-2`} range={range} record={recNumbers} onUpdateRecord={v=>upRec("rec_numbers",v,setRecNumbers)} onBack={goSettings}/>;
    }
    // ЦВЕТА
    if(rubric==="colors"){
      const { set, level } = colorSettings;
      if(level===1)
        return <GameColorsLearnScreen key={`c-${set}-1`} colorSet={set} record={recColors} onUpdateRecord={v=>upRec("rec_colors",v,setRecColors)} onBack={goSettings}/>;
      if(level===2)
        return <GameColorsQuizScreen  key={`c-${set}-2`} colorSet={set} record={recColors} onUpdateRecord={v=>upRec("rec_colors",v,setRecColors)} onBack={goSettings}/>;
    }
    // ФИГУРЫ
    if(rubric==="shapes"){
      const { set, level } = shapesSettings;
      if(level===1)
        return <GameShapesLearnScreen key={`s-${set}-1`} shapeSet={set} record={recShapes} onUpdateRecord={v=>upRec("rec_shapes",v,setRecShapes)} onBack={goSettings}/>;
      if(level===2)
        return <GameShapesQuizScreen  key={`s-${set}-2`} shapeSet={set} record={recShapes} onUpdateRecord={v=>upRec("rec_shapes",v,setRecShapes)} onBack={goSettings}/>;
    }
  }

  return null;
}
