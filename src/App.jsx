import { useState, useEffect, useRef } from "react";
import { GLOBAL_STYLES } from "./lib/styles";
import { MECH_LEVEL } from "./lib/skills";
import { REGISTRY } from "./games/registry";
import SkillsScreen from "./components/SkillsScreen";
import MechanicsScreen from "./components/MechanicsScreen";
import ContentScreen from "./components/ContentScreen";
import SettingsScreen from "./components/SettingsScreen";
import GameLearnScreen from "./games/GameLearnScreen";
import GameQuizScreen from "./games/GameQuizScreen";
import GameCategoriesScreen from "./games/GameCategoriesScreen";

// Состояние, сохранённое перед обновлением приложения (см. VersionButton)
const RESTORE = (() => {
  try {
    const raw = sessionStorage.getItem("kg_restore");
    if (raw) { sessionStorage.removeItem("kg_restore"); return JSON.parse(raw); }
  } catch {}
  return null;
})();

export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(style); document.head.removeChild(link); };
  }, []);

  // screen: "skills" | "mechanics" | "content" | "subsets" | "game"
  const [screen,   setScreen]   = useState(RESTORE?.screen   || "skills");
  const [skill,    setSkill]    = useState(RESTORE?.skill    ?? null);
  const [mechanic, setMechanic] = useState(RESTORE?.mechanic ?? null);
  const [rubric,   setRubric]   = useState(RESTORE?.rubric   ?? null);
  const [exitHint, setExitHint] = useState(false);

  const [settingsByRubric, setSettingsByRubric] = useState(() => {
    const init = {};
    for (const id in REGISTRY) init[id] = REGISTRY[id].defaultSettings;
    return RESTORE?.settingsByRubric ? { ...init, ...RESTORE.settingsByRubric } : init;
  });

  const [records, setRecords] = useState(() => {
    const init = {};
    for (const id in REGISTRY) init[id] = parseInt(localStorage.getItem(REGISTRY[id].recordKey) || "0", 10);
    return init;
  });

  function upRecord(id, val) {
    setRecords(r => ({ ...r, [id]: val }));
    localStorage.setItem(REGISTRY[id].recordKey, val);
  }

  // ---- Кнопка "назад" на телефоне ----
  const exitHintRef = useRef(false);
  useEffect(() => {
    window.history.pushState({ screen: "skills" }, "", "#skills");
    function onPopState() {
      const hash = window.location.hash;
      if (hash === "#skills")    { setScreen("skills");    return; }
      if (hash === "#mechanics") { setScreen("mechanics"); return; }
      if (hash === "#content")   { setScreen("content");   return; }
      if (hash === "#subsets")   { setScreen("subsets");   return; }
      if (hash === "#game")      { setScreen("game");      return; }
      // hash === "" — попытка выйти
      if (exitHintRef.current) return;
      exitHintRef.current = true;
      setExitHint(true);
      window.history.pushState({ screen: "skills" }, "", "#skills");
      setTimeout(() => { exitHintRef.current = false; setExitHint(false); }, 2000);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function goTo(s) {
    setScreen(s);
    window.history.pushState({ screen: s }, "", `#${s}`);
  }
  const goBack = () => window.history.back();

  // ---- НАВЫКИ ----
  if (screen === "skills") return (
    <>
      <SkillsScreen onSelect={id => { setSkill(id); goTo("mechanics"); }}/>
      {exitHint && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.75)", color: "#fff", padding: "10px 20px",
          borderRadius: 999, fontSize: "0.95rem", fontWeight: 700, zIndex: 1000, whiteSpace: "nowrap",
        }}>
          Нажмите «Назад» еще раз, чтобы выйти
        </div>
      )}
    </>
  );

  // ---- МЕХАНИКИ ----
  if (screen === "mechanics") return (
    <MechanicsScreen
      skill={skill}
      onSelect={id => { setMechanic(id); goTo("content"); }}
      onBack={goBack}
    />
  );

  // ---- КОНТЕНТ ----
  if (screen === "content") return (
    <ContentScreen
      mechanic={mechanic}
      onSelect={id => { setRubric(id); goTo("subsets"); }}
      onBack={goBack}
    />
  );

  const config   = REGISTRY[rubric];
  const settings = settingsByRubric[rubric];
  const onChangeSettings = s => setSettingsByRubric(prev => ({ ...prev, [rubric]: s }));

  // ---- ПОДСЕТЫ ----
  if (screen === "subsets") return (
    <SettingsScreen
      emoji={config.emoji} title={config.title}
      sections={config.getSettingsSections(settings, onChangeSettings)}
      onStart={() => goTo("game")}
      onBack={goBack}
    />
  );

  // ---- ИГРА ----
  if (screen === "game") {
    const level = MECH_LEVEL[mechanic] ?? 1;
    const gameSettings = { ...settings, level };
    const items = config.getDataset(gameSettings, level);
    const label = config.getLabel ? config.getLabel(settings) : undefined;
    const record = records[rubric];
    const gameKey = `${rubric}-${mechanic}-${JSON.stringify(settings)}`;

    if (level === 1)
      return <GameLearnScreen key={gameKey} config={config} items={items} label={label} record={record} onUpdateRecord={v => upRecord(rubric, v)} onBack={goBack}/>;
    if (level === 2 || level === 3)
      return <GameQuizScreen  key={gameKey} config={config} items={items} label={label} record={record} onUpdateRecord={v => upRecord(rubric, v)} onBack={goBack}/>;
    if (level === 4) {
      const categoryLabel = config.getCategoryLabel
        ? config.getCategoryLabel(settings)
        : (config.categoryLabel ?? "предмет");
      return <GameCategoriesScreen key={gameKey} config={config} contentId={rubric} categoryLabel={categoryLabel} items={items} label={label} record={record} onUpdateRecord={v => upRecord(rubric, v)} onBack={goBack}/>;
    }
  }

  return null;
}
