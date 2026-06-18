import { useState, useEffect, useRef } from "react";
import { speak, speakSequence, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const MIN_COUNT = 1;
const MAX_COUNT = 5;

function generateRound(items, prevMode) {
  // Alternate modes or pick randomly
  const mode = prevMode === "more" ? "less" : "more";
  const task = mode === "more" ? "Где больше?" : "Где меньше?";

  // Pick two different counts
  let countA = Math.floor(Math.random() * MAX_COUNT) + MIN_COUNT;
  let countB;
  do {
    countB = Math.floor(Math.random() * MAX_COUNT) + MIN_COUNT;
  } while (countB === countA);

  // Correct side is whichever satisfies the mode
  const correctSide = mode === "more"
    ? (countA > countB ? "left" : "right")
    : (countA < countB ? "left" : "right");

  // Pick items for each group (can be different or same)
  const pool = shuffle([...items]);
  const itemA = pool[0];
  const itemB = pool[Math.min(1, pool.length - 1)];

  return { mode, task, countA, countB, itemA, itemB, correctSide };
}

function GroupPanel({ item, count, side, chosen, answerState, onClick }) {
  const isChosen = chosen === side;
  const isCorrectSide = answerState === "correct" && isChosen;

  let bg = "#fff";
  if (isChosen && answerState === "correct") bg = "var(--green)";
  else if (isChosen && answerState === "wrong") bg = "var(--red)";

  const cols = count <= 3 ? count : Math.ceil(Math.sqrt(count));

  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, minHeight: "clamp(140px,38vw,220px)",
        background: bg, border: `3px solid ${isChosen ? "transparent" : "#E0E0E0"}`,
        borderRadius: 22, cursor: "pointer",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 10, padding: "clamp(12px,3vw,20px)",
        boxShadow: isChosen ? "none" : "0 6px 16px rgba(0,0,0,0.08)",
        transform: isChosen ? "scale(0.95)" : "scale(1)",
        transition: "background 0.2s, transform 0.15s",
        animation: isChosen && answerState === "wrong" ? "shake 0.5s" : "none",
      }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "clamp(4px,1.5vw,8px)",
        justifyItems: "center",
      }}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} style={{
            fontSize: "clamp(1.6rem,8vw,2.4rem)", lineHeight: 1,
            display: "block",
            filter: isChosen && answerState ? "none" : "none",
          }}>
            {item.emoji}
          </span>
        ))}
      </div>
    </button>
  );
}

export default function GameCompareScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const [round, setRound]         = useState(() => generateRound(items, null));
  const [chosen, setChosen]       = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);

  const introRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!introRef.current) { introRef.current = true; speakSequence(round.task, ""); }
      else speak(round.task);
    }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function advanceRound() {
    setRound(generateRound(items, round.mode));
    setChosen(null);
    setAnswerState(null);
  }

  function handleChoice(side) {
    if (answerState !== null) return;
    setChosen(side);
    const isCorrect = side === round.correctSide;
    if (isCorrect) {
      playSuccess();
      setAnswerState("correct");
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(advanceRound, 800);
    } else {
      playError();
      setAnswerState("wrong");
      setStreak(0);
      setTimeout(() => { setChosen(null); setAnswerState(null); }, 700);
    }
  }

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title={round.task} subtitle="Нажми на нужную группу"/>

      {/* Two groups */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        gap: "clamp(10px,3vw,20px)",
        width: "100%", maxWidth: 500,
      }}>
        <GroupPanel
          item={round.itemA} count={round.countA}
          side="left" chosen={chosen} answerState={answerState}
          onClick={() => handleChoice("left")}
        />
        <GroupPanel
          item={round.itemB} count={round.countB}
          side="right" chosen={chosen} answerState={answerState}
          onClick={() => handleChoice("right")}
        />
      </div>

      <BottomBar>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => speak(round.task)}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={advanceRound}>Следующий ➡️</button>
      </BottomBar>
    </div>
  );
}
