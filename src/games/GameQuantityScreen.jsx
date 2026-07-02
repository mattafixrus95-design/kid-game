import { useState, useEffect, useRef } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { speak, speakSequence, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import { useBag } from "../lib/useBag";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const MIN_COUNT = 1;
const MAX_COUNT = 5;

function makeOptions(count) {
  const dists = new Set();
  for (const delta of [-2, -1, 1, 2]) {
    const n = count + delta;
    if (n >= MIN_COUNT && n <= MAX_COUNT + 2 && n !== count) dists.add(n);
  }
  for (let n = 1; dists.size < 3; n++) {
    if (n !== count) dists.add(n);
  }
  return shuffle([count, ...[...dists].slice(0, 3)]);
}

export default function GameQuantityScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const task = "Сколько предметов?";
  const nextItem = useBag(items);
  const [nextDisabled, setNextDisabled] = useState(false);

  const prevCountRef = useRef(null);
  function makeRound() {
    const counts = Array.from({ length: MAX_COUNT - MIN_COUNT + 1 }, (_, i) => i + MIN_COUNT)
      .filter(n => n !== prevCountRef.current);
    const count = counts[Math.floor(Math.random() * counts.length)];
    prevCountRef.current = count;
    return { item: nextItem(), count, options: makeOptions(count) };
  }

  const [round, setRound]         = useState(() => makeRound());
  const [chosen, setChosen]       = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);

  const introRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!introRef.current) { introRef.current = true; speakSequence(task, ""); }
      else speak(task);
    }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function advanceRound() {
    setRound(makeRound());
    setChosen(null);
    setAnswerState(null);
  }

  function handleNext() {
    if (nextDisabled) return;
    setNextDisabled(true);
    setTimeout(() => setNextDisabled(false), 500);
    advanceRound();
  }

  function handleAnswer(n) {
    if (answerState !== null) return;
    setChosen(n);
    if (n === round.count) {
      playSuccess();
      setAnswerState("correct");
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(advanceRound, 700);
    } else {
      playError();
      setAnswerState("wrong");
      setStreak(0);
      setTimeout(() => { setChosen(null); setAnswerState(null); }, 700);
    }
  }

  const emojis = Array.from({ length: round.count }, (_, i) => i);
  const cols = round.count <= 3 ? round.count : Math.ceil(Math.sqrt(round.count));

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>
      <RoundTitle title={task} subtitle="Выбери правильное число"/>

      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 24,
          border: "3px solid #E0E0E0",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          padding: "clamp(16px,4vw,28px)",
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: "clamp(6px,2vw,14px)",
          minWidth: "clamp(150px,40vw,260px)",
        }}>
          {emojis.map(i => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "clamp(48px,14vw,72px)", height: "clamp(48px,14vw,72px)",
              background: "var(--bg)",
              borderRadius: 14,
            }}>
              <span style={{ fontSize: "clamp(2rem,10vw,3rem)", lineHeight: 1 }}>
                {round.item.emoji}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "center",
        width: "100%", gap: "clamp(10px,3vw,18px)", maxWidth: 400,
      }}>
        {round.options.map(n => {
          const isChosen = chosen === n;
          const bg = isChosen
            ? (answerState === "correct" ? "var(--green)" : "var(--red)")
            : "var(--primary)";
          return (
            <button key={n}
              onClick={() => handleAnswer(n)}
              style={{
                flex: "1 1 calc(50% - 8px)", minWidth: 90, maxWidth: 180, aspectRatio: "1/1",
                background: bg, border: "none",
                borderRadius: 20, color: "#fff",
                fontSize: "clamp(2.2rem,12vw,4rem)", fontWeight: 900,
                cursor: "pointer",
                boxShadow: isChosen ? "none" : "0 6px 0 var(--primary-d)",
                transform: isChosen ? "scale(0.93) translateY(4px)" : "scale(1)",
                transition: "transform 0.15s, background 0.2s, box-shadow 0.15s",
                animation: isChosen && answerState === "wrong" ? "shake 0.5s" : "none",
              }}>
              {n}
            </button>
          );
        })}
      </div>

      <BottomBar onBack={onBack}>
        <button className="btn btn-bar" onClick={() => speak(task)}>🔊 Повторить</button>
        <button className="btn btn-bar" onClick={handleNext} disabled={nextDisabled}>Далее →</button>
      </BottomBar>
    </div>
  );
}
