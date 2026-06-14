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

export default function VehicleSVG({ name, color, size = 140 }) {
  const vb = "0 0 200 120";
  const w = size; const h = size * 0.6;
  const c = color;

  const shapes = {
    /* ---- ЛЕГКОВАЯ МАШИНА ---- */
    "Легковая машина": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Кузов */}
        <rect x="10" y="60" width="180" height="35" rx="8" fill={c || "#E53935"}/>
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
        <rect x="8"  y="38" width="110" height="52" rx="5" fill={c || "#90A4AE"}/>
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
        <rect x="8" y="32" width="184" height="58" rx="10" fill={c || "#FF8F00"}/>
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
        <rect x="10" y="60" width="180" height="35" rx="8" fill={c || "#FDD835"}/>
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
        <ellipse cx="110" cy="66" rx="22" ry="10" fill={c || "#6A1B9A"}/>
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
        <rect x="50" y="50" width="110" height="32" rx="6" fill={c || "#F9A825"}/>
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
        <rect x="40" y="46" width="120" height="36" rx="6" fill={c || "#FF8F00"}/>
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
        <rect x="20" y="56" width="115" height="16" rx="5" fill={c || "#E53935"}/>
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
        <rect x="68" y="46" width="116" height="34" rx="6" fill={c || "#FDD835"}/>
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
        <rect x="30" y="56" width="130" height="28" rx="6" fill={c || "#1976D2"}/>
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
        <polygon points="14,72 122,72 106,24 14,24" fill={c || "#1E88E5"}/>
        <rect x="10" y="22" width="8" height="52" rx="3" fill="#0D47A1"/>
        {/* Гидроцилиндр */}
        <line x1="122" y1="72" x2="106" y2="42" stroke="#999" strokeWidth="6" strokeLinecap="round"/>
        <W cx={42}/><W cx={82}/><W cx={152}/><W cx={175}/>
      </svg>
    ),
    /* ---- ПОЖАРНАЯ МАШИНА ---- */
    "Пожарная машина": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Кузов */}
        <rect x="8" y="52" width="184" height="38" rx="7" fill={c || "#D32F2F"}/>
        {/* Кабина */}
        <rect x="120" y="28" width="68" height="26" rx="7" fill="#B71C1C"/>
        <rect x="128" y="33" width="52" height="16" rx="3" {...WINDOW_STYLE}/>
        {/* Кузов сзади с инвентарём */}
        <rect x="14" y="30" width="96" height="24" rx="5" fill="#B71C1C"/>
        <rect x="20" y="36" width="20" height="12" rx="2" fill="#EF9A9A"/>
        <rect x="48" y="36" width="20" height="12" rx="2" fill="#EF9A9A"/>
        <rect x="76" y="36" width="20" height="12" rx="2" fill="#EF9A9A"/>
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
        {/* Кузов */}
        <rect x="30" y="40" width="140" height="50" rx="9" fill={c || "#FFFFFF"}/>
        <rect x="118" y="46" width="42" height="22" rx="6" {...WINDOW_STYLE}/>
        {/* Крест */}
        <rect x="56" y="52" width="40" height="12" rx="3" fill="#E53935"/>
        <rect x="70" y="44" width="12" height="28" rx="3" fill="#E53935"/>
        {/* Полоса */}
        <rect x="30" y="74" width="140" height="9" fill="#E53935"/>
        {/* Маячок */}
        <rect x="120" y="30" width="14" height="8" rx="3" fill="#1E88E5"/>
        <W cx={62}/><W cx={148}/>
      </svg>
    ),
    /* ---- ПОЛИЦЕЙСКАЯ МАШИНА ---- */
    "Полицейская машина": (
      <svg width={w} height={h} viewBox={vb}>
        <rect x="10" y="60" width="180" height="34" rx="8" fill={c || "#1565C0"}/>
        <path d="M50,60 Q60,30 100,26 Q140,22 155,60 Z" fill="#0D47A1"/>
        <path d="M58,58 Q66,38 100,34 Q125,32 135,58 Z" {...WINDOW_STYLE}/>
        {/* Полоса */}
        <rect x="10" y="78" width="180" height="8" fill="#FFFFFF"/>
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
        {/* Кабина и шасси */}
        <rect x="8" y="40" width="90" height="50" rx="7" fill={c || "#2E7D32"}/>
        <rect x="16" y="46" width="40" height="26" rx="3" {...WINDOW_STYLE}/>
        {/* Кран, развёрнутый назад */}
        <rect x="92" y="30" width="12" height="40" rx="3" fill="#1B5E20"/>
        <line x1="98" y1="32" x2="160" y2="14" stroke="#43A047" strokeWidth="7" strokeLinecap="round"/>
        <line x1="160" y1="14" x2="158" y2="48" stroke="#888" strokeWidth="2" strokeDasharray="4,3"/>
        <path d="M152,48 Q150,56 156,56 Q162,56 160,48" fill="none" stroke="#555" strokeWidth="2.5"/>
        {/* Платформа, которую тащат */}
        <polygon points="120,86 192,86 184,68 128,68" fill="#A5D6A7"/>
        <line x1="124" y1="74" x2="186" y2="74" stroke="#1B5E20" strokeWidth="2"/>
        <W cx={36}/><W cx={76}/><W cx={140}/><W cx={176}/>
      </svg>
    ),
    /* ---- МУСОРНАЯ МАШИНА ---- */
    "Мусорная машина": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Шасси */}
        <rect x="8" y="62" width="184" height="24" rx="6" fill="#8BC34A"/>
        {/* Кабина */}
        <rect x="128" y="32" width="60" height="32" rx="7" fill="#689F38"/>
        <rect x="136" y="37" width="44" height="22" rx="3" {...WINDOW_STYLE}/>
        {/* Контейнер */}
        <rect x="10" y="30" width="112" height="36" rx="6" fill={c || "#FFFFFF"}/>
        <rect x="6"  y="28" width="10" height="40" rx="4" fill="#BDBDBD"/>
        <line x1="10" y1="46" x2="120" y2="46" stroke="#BDBDBD" strokeWidth="3"/>
        {[20,44,68,92].map(x => <rect key={x} x={x} y="32" width="18" height="12" rx="2" fill="#E0E0E0"/>)}
        <W cx={42}/><W cx={80}/><W cx={152}/><W cx={175}/>
      </svg>
    ),
    /* ---- БЕНЗОВОЗ ---- */
    "Бензовоз": (
      <svg width={w} height={h} viewBox={vb}>
        {/* Шасси */}
        <rect x="8" y="76" width="184" height="14" rx="4" fill="#9E9E9E"/>
        {/* Кабина */}
        <rect x="150" y="42" width="44" height="34" rx="6" fill="#757575"/>
        <rect x="156" y="47" width="32" height="20" rx="3" {...WINDOW_STYLE}/>
        {/* Цистерна, лежащая на боку */}
        <rect x="10" y="34" width="132" height="46" rx="23" fill={c || "#FF8F00"}/>
        <rect x="10" y="34" width="132" height="18" rx="9" fill="#fff" opacity="0.25"/>
        {/* Крышка */}
        <rect x="68" y="22" width="20" height="14" rx="3" fill="#757575"/>
        <ellipse cx="78" cy="22" rx="10" ry="4" fill="#9E9E9E"/>
        <W cx={42}/><W cx={104}/><W cx={166}/>
      </svg>
    ),
  };

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
      {shapes[name] || <span style={{ fontSize: size * 0.5 }}>🚗</span>}
    </div>
  );
}
