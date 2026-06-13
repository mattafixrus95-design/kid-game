// ============================================================
// РАЗВИВАШКИ — App.jsx  v5
// ============================================================

import { useState, useEffect, useRef } from "react";
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
  const [exitHint, setExitHint] = useState(false);

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

  const goBack = ()=>window.history.back();
  const goGame = ()=>{ setScreen("game"); window.history.pushState({ screen:"game" }, "", "#game"); };

  function handleSelect(id){
    setRubric(id);
    setScreen("settings");
    window.history.pushState({ screen:"settings" }, "", "#settings");
  }

  // ---- Кнопка "назад" на телефоне ----
  const exitHintRef = useRef(false);
  useEffect(()=>{
    window.history.pushState({ screen:"menu" }, "", "#menu");
    function onPopState(){
      const hash = window.location.hash;
      if(hash===""){
        if(exitHintRef.current){
          // повторное нажатие "назад" — даём приложению закрыться
        } else {
          exitHintRef.current = true;
          setExitHint(true);
          window.history.pushState({ screen:"menu" }, "", "#menu");
          setTimeout(()=>{ exitHintRef.current=false; setExitHint(false); }, 2000);
        }
        return;
      }
      setScreen(hash==="#settings" ? "settings" : hash==="#game" ? "game" : "menu");
    }
    window.addEventListener("popstate", onPopState);
    return ()=>window.removeEventListener("popstate", onPopState);
  },[]);

  // ---- МЕНЮ ----
  if(screen==="menu") return (
    <>
      <MenuScreen onSelect={handleSelect}/>
      {exitHint && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          background:"rgba(0,0,0,0.75)", color:"#fff", padding:"10px 20px",
          borderRadius:999, fontSize:"0.95rem", fontWeight:700, zIndex:1000,
          whiteSpace:"nowrap",
        }}>
          Нажмите «Назад» еще раз, чтобы выйти
        </div>
      )}
    </>
  );

  const config = REGISTRY[rubric];
  const settings = settingsByRubric[rubric];
  const onChangeSettings = s => setSettingsByRubric(prev => ({ ...prev, [rubric]: s }));

  // ---- НАСТРОЙКИ ----
  if(screen==="settings"){
    return (
      <SettingsScreen
        emoji={config.emoji} title={config.title}
        sections={config.getSettingsSections(settings, onChangeSettings)}
        onStart={goGame} onBack={goBack}
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
      return <GameLearnScreen key={gameKey} config={config} items={items} label={label} record={record} onUpdateRecord={onUpdateRecord} onBack={goBack}/>;
    if(settings.level===2)
      return <GameQuizScreen key={gameKey} config={config} items={items} label={label} record={record} onUpdateRecord={onUpdateRecord} onBack={goBack}/>;
  }

  return null;
}
