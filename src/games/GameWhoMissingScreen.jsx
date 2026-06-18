import { useState, useEffect, useRef } from "react";
import { speak, speakSequence, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

function generateRound(items) {
  const pool = shuffle([...items]);
  const shown = pool.slice(0, 6);
  const missing = shown[Math.floor(Math.random() * shown.length)];
  const distractors = shuffle(shown.filter(i => i !== missing)).slice(0, 3);
  const options = shuffle([missing, ...distractors]);
  return { shown, missing, options };
}

export default function GameWhoMissingScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const [phase, setPhase]         = useState("memorize"); // "memorize" | "quiz"
  const [round, setRound]         = useState(() => generateRound(items));
  const [chosen, setChosen]       = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);

  const introRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!introRef.current) { introRef.current = true; speakSequence("Запомни кто здесь", ""); }
      else speak("Запомни кто здесь");
    }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function startQuiz() {
    speak("Кто пропал?");
    setPhase("quiz");
  }

  function advanceRound() {
    setRound(generateRound(items));
    setChosen(null);
    setAnswerState(null);
    setPhase("memorize");
  }

  function handleAnswer(item) {
    if (answerState !== null) return;
    const key = config.getKey(item);
    const correctKey = config.getKey(round.missing);
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

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "clamp(8px,2.5vw,16px)",
    width: "100%",
    maxWidth: 480,
  };

  if (phase === "memorize") return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title="Запомни!" subtitle="Кто здесь нарисован?"/>
      <div style={gridStyle}>
        {round.shown.map(item => (
          <div key={config.getKey(item)} style={{
            background: "var(--accent)", borderRadius: 18,
            aspectRatio: "1/1", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 4,
            boxShadow: "0 4px 0 rgba(0,0,0,0.10)",
          }}>
            <span style={{ fontSize: "clamp(2rem,12vw,4rem)" }}>{item.emoji}</span>
            <span style={{ fontSize: "clamp(0.7rem,2.5vw,1rem)", fontWeight: 700, color: "#fff", textAlign: "center" }}>
              {config.getName(item)}
            </span>
          </div>
        ))}
      </div>
      <BottomBar>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={startQuiz}>
          Запомнил! ➡️
        </button>
      </BottomBar>
    </div>
  );

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title="Кто пропал?" subtitle="Выбери того, кого нет"/>
      <div style={{
        flex: 1, display: "flex", flexWrap: "wrap",
        alignItems: "center", alignContent: "center", justifyContent: "center",
        width: "100%", gap: "clamp(10px,3vw,20px)", maxWidth: 560,
      }}>
        {round.options.map(item => {
          const key = config.getKey(item);
          const isChosen = chosen === key;
          const bg = isChosen
            ? (answerState === "correct" ? "var(--green)" : "var(--red)")
            : "var(--accent)";
          return (
            <button key={key}
              onClick={() => handleAnswer(item)}
              style={{
                flex: "1 1 calc(50% - 8px)", minWidth: 120, maxWidth: 260, aspectRatio: "1/1",
                background: bg, border: "3px solid transparent",
                borderRadius: 20, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
                cursor: "pointer", boxShadow: "0 6px 0 rgba(0,0,0,0.12)",
                transform: isChosen ? "scale(0.93)" : "scale(1)",
                transition: "transform 0.15s, background 0.2s",
              }}>
              <span style={{ fontSize: "clamp(3rem,18vw,6rem)" }}>{item.emoji}</span>
              <span style={{ fontSize: "clamp(0.85rem,3vw,1.3rem)", fontWeight: 700, color: "#fff", textAlign: "center" }}>
                {config.getName(item)}
              </span>
            </button>
          );
        })}
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => speak("Кто пропал?")}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={advanceRound}>Следующий ➡️</button>
      </BottomBar>
    </div>
  );
}
