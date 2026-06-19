import { useState, useEffect } from "react";
import { speak, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import { useBag } from "../lib/useBag";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const SHOWN_COUNT = 4;

function generateRound(items, nextItem, getKey) {
  // Pick 4 unique items via bag
  const shown = [];
  const usedKeys = new Set();
  while (shown.length < Math.min(SHOWN_COUNT, items.length)) {
    const item = nextItem();
    if (!usedKeys.has(getKey(item))) {
      usedKeys.add(getKey(item));
      shown.push(item);
    }
  }
  const missingIdx = Math.floor(Math.random() * shown.length);
  const missing = shown[missingIdx];
  // Remaining visible items (3 slots)
  const visible = shown.filter((_, i) => i !== missingIdx);
  // Distractors: items not in shown set
  const distractors = shuffle(items.filter(i => !usedKeys.has(getKey(i)))).slice(0, 3);
  const options = shuffle([missing, ...distractors]);
  return { shown, visible, missing, options };
}

function ItemCard({ item, getName, size = "clamp(2.4rem,13vw,4rem)" }) {
  return (
    <div style={{
      background: "var(--accent)", borderRadius: 18,
      aspectRatio: "1/1", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 0, padding: "8px 6px",
      boxShadow: "0 4px 0 rgba(0,0,0,0.10)",
      overflow: "hidden",
    }}>
      <span style={{ fontSize: size, lineHeight: 1, flexShrink: 0 }}>{item.emoji}</span>
      <span style={{
        fontSize: "clamp(0.65rem,2.2vw,0.9rem)", fontWeight: 700,
        color: "#fff", textAlign: "center", marginTop: 4,
        lineHeight: 1.1, wordBreak: "break-word",
      }}>
        {getName(item)}
      </span>
    </div>
  );
}

export default function GameWhoMissingScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const { getKey, getName } = config;
  const nextItem = useBag(items);
  const [phase, setPhase]         = useState("memorize");
  const [round, setRound]         = useState(() => generateRound(items, nextItem, getKey));
  const [chosen, setChosen]       = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [nextDisabled, setNextDisabled] = useState(false);

  // Озвучка только при переходе на экран "Кто пропал?"
  useEffect(() => {
    if (phase === "quiz") {
      const t = setTimeout(() => speak("Кто пропал?"), 300);
      return () => clearTimeout(t);
    }
  }, [phase]);

  function startQuiz() { setPhase("quiz"); }

  function advanceRound() {
    setRound(generateRound(items, nextItem, getKey));
    setChosen(null);
    setAnswerState(null);
    setPhase("memorize");
  }

  function handleAnswer(item) {
    if (answerState !== null) return;
    const key = getKey(item);
    const correctKey = getKey(round.missing);
    setChosen(key);
    if (key === correctKey) {
      playSuccess();
      setAnswerState("correct");
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(advanceRound, 900);
    } else {
      playError();
      setAnswerState("wrong");
      setStreak(0);
      setTimeout(() => { setChosen(null); setAnswerState(null); }, 700);
    }
  }

  const gridStyle2x2 = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "clamp(10px,3vw,18px)",
    width: "100%",
    maxWidth: 380,
  };

  // ── Экран 1: Запомни ──────────────────────────────────
  if (phase === "memorize") return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title="Запомни предметы" subtitle="Посмотри внимательно"/>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={gridStyle2x2}>
          {round.shown.map(item => (
            <ItemCard key={getKey(item)} item={item} getName={getName}/>
          ))}
        </div>
      </div>
      <BottomBar>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={startQuiz}>Далее ➡️</button>
      </BottomBar>
    </div>
  );

  // ── Экран 2: Кто пропал? ─────────────────────────────
  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title="Кто пропал?" subtitle="Кого не хватает?"/>

      {/* 3 оставшихся предмета */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: "clamp(8px,2.5vw,14px)", width: "100%", maxWidth: 360,
      }}>
        {round.visible.map(item => (
          <ItemCard key={getKey(item)} item={item} getName={getName} size="clamp(1.8rem,10vw,3rem)"/>
        ))}
      </div>

      {/* Варианты ответа */}
      <div style={{
        flex: 1, display: "flex", flexWrap: "wrap",
        alignItems: "center", alignContent: "center", justifyContent: "center",
        width: "100%", gap: "clamp(10px,3vw,20px)", maxWidth: 560,
      }}>
        {round.options.map(item => {
          const key = getKey(item);
          const isChosen = chosen === key;
          const bg = isChosen
            ? (answerState === "correct" ? "var(--green)" : "var(--red)")
            : "var(--accent)";
          return (
            <button key={key} onClick={() => handleAnswer(item)}
              style={{
                flex: "1 1 calc(50% - 8px)", minWidth: 120, maxWidth: 260, aspectRatio: "1/1",
                background: bg, border: "3px solid transparent",
                borderRadius: 20, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 4, padding: "8px 6px",
                cursor: "pointer", boxShadow: "0 6px 0 rgba(0,0,0,0.12)",
                transform: isChosen ? "scale(0.93)" : "scale(1)",
                transition: "transform 0.15s, background 0.2s",
                animation: isChosen && answerState === "wrong" ? "shake 0.5s" : "none",
              }}>
              <span style={{ fontSize: "clamp(2.5rem,15vw,5rem)", lineHeight: 1 }}>{item.emoji}</span>
              <span style={{ fontSize: "clamp(0.8rem,2.8vw,1.1rem)", fontWeight: 700, color: "#fff", textAlign: "center", lineHeight: 1.1 }}>
                {getName(item)}
              </span>
            </button>
          );
        })}
      </div>

      <BottomBar>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => speak("Кто пропал?")}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
          if (nextDisabled) return;
          setNextDisabled(true);
          setTimeout(() => setNextDisabled(false), 500);
          advanceRound();
        }} disabled={nextDisabled}>Далее ➡️</button>
      </BottomBar>
    </div>
  );
}
