// ============================================================
// РАЗВИВАШКИ — App.jsx  v5
// ============================================================

import { useState, useEffect } from "react";
import { GLOBAL_STYLES } from "./lib/styles";
import { REGISTRY } from "./games/registry";
import MenuScreen from "./components/MenuScreen";
import SettingsScreen from "./components/SettingsScreen";
import GameLearnScreen from "./games/GameLearnScreen";
import GameQuizScreen from "./games/GameQuizScreen";

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
  const [settingsByRubric, setSettingsByRubric] = useState(()=>{
    const init = {};
    for (const id in REGISTRY) init[id] = REGISTRY[id].defaultSettings;
    return init;
  });

  // Рекорды
  const [records, setRecords] = useState(()=>{
    const init = {};
    for (const id in REGISTRY) init[id] = parseInt(localStorage.getItem(REGISTRY[id].recordKey) || "0", 10);
    return init;
  });

  function upRecord(id, val) {
    setRecords(r => ({ ...r, [id]: val }));
    localStorage.setItem(REGISTRY[id].recordKey, val);
  }

  const goMenu     = ()=>setScreen("menu");
  const goSettings = ()=>setScreen("settings");
  const goGame     = ()=>setScreen("game");

  function handleSelect(id){ setRubric(id); setScreen("settings"); }

  // ---- МЕНЮ ----
  if(screen==="menu") return <MenuScreen onSelect={handleSelect}/>;

  const config = REGISTRY[rubric];
  const settings = settingsByRubric[rubric];
  const onChangeSettings = s => setSettingsByRubric(prev => ({ ...prev, [rubric]: s }));

  // ---- НАСТРОЙКИ ----
  if(screen==="settings"){
    return (
      <SettingsScreen
        emoji={config.emoji} title={config.title}
        sections={config.getSettingsSections(settings, onChangeSettings)}
        onStart={goGame} onBack={goMenu}
      />
    );
  }

  // ---- ИГРА ----
  if(screen==="game"){
    const items = config.getDataset(settings);
    const label = config.getLabel ? config.getLabel(settings) : undefined;
    const record = records[rubric];
    const onUpdateRecord = v => upRecord(rubric, v);
    const gameKey = `${rubric}-${JSON.stringify(settings)}`;

    if(settings.level===1)
      return <GameLearnScreen key={gameKey} config={config} items={items} label={label} record={record} onUpdateRecord={onUpdateRecord} onBack={goSettings}/>;
    if(settings.level===2)
      return <GameQuizScreen key={gameKey} config={config} items={items} label={label} record={record} onUpdateRecord={onUpdateRecord} onBack={goSettings}/>;
  }

  return null;
}
