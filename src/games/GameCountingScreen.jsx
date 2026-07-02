import { useState, useEffect, useRef } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { speak, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const COUNT_WORDS = ["", "один", "два", "три", "четыре", "пять", "шесть"];
const MIN_COUNT = 2;
const MAX_COUNT = 5;

function generateRound(items, prevCount) {
  const counts = Array.from({ length: MAX_COUNT - MIN_COUNT + 1 }, (_, i) => i + MIN_COUNT)
    .filter(n => n !== prevCount);
  const count = counts[Math.floor(Math.random() * counts.length)];
  const pool = shuffle([...items]);
  // Pick `count` items (with possible repeats if pool is small)
  const chosen = Array.from({ length: count }, (_, i) => pool[i % pool.length]);
  return { items: chosen, count };
}

function buildOptions(count) {
  const dists = new Set();
  for (const delta of [-2, -1, 1, 2]) {
    const n = count + delta;
    if (n >= 1 && n <= MAX_COUNT + 2 && n !== count) dists.add(n);
  }
  for (let n = 1; dists.size < 3; n++) {
    if (n !== count) dists.add(n);
  }
  return shuffle([count, ...[...dists].slice(0, 3)]);
}

export default function GameCountingScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const [round, setRound]         = useState(() => generateRound(items, null));
  const [revealed, setRevealed]   = useState(0);       // how many items shown
  const [phase, setPhase]         = useState("reveal"); // "reveal" | "quiz"
  const [activeIdx, setActiveIdx] = useState(null);    // currently highlighted item
  const [options, setOptions]     = useState([]);
  const [chosen, setChosen]       = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);

  const revealedRef = useRef(0);

  function startRound(prevCount) {
    const r = generateRound(items, prevCount);
    setRound(r);
    setRevealed(0);
    revealedRef.current = 0;
    setPhase("reveal");
    setActiveIdx(null);
    setChosen(null);
    setAnswerState(null);
    setTimeout(() => speak("Считай вместе!"), 300);
  }

  useEffect(() => {
    setTimeout(() => speak("Считай вместе!"), 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function revealNext() {
    const next = revealedRef.current + 1;
    if (next > round.count) return;
    revealedRef.current = next;
    setRevealed(next);
    setActiveIdx(next - 1);
    speak(COUNT_WORDS[next] || String(next));
    setTimeout(() => setActiveIdx(null), 600);

    if (next === round.count) {
      // All revealed — transition to quiz
      setTimeout(() => {
        setPhase("quiz");
        setOptions(buildOptions(round.count));
        speak("Сколько всего?");
      }, 800);
    }
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
      setTimeout(() => startRound(round.count), 900);
    } else {
      playError();
      setAnswerState("wrong");
      setStreak(0);
      setTimeout(() => { setChosen(null); setAnswerState(null); }, 700);
    }
  }

  // Items display — show `revealed` items, highlight activeIdx
  const displayItems = round.items.slice(0, revealed);

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>

      <RoundTitle
        title={phase === "reveal" ? "Считай вместе!" : "Сколько всего?"}
        subtitle={phase === "reveal" ? `${revealed} из ${round.count}` : "Выбери число"}
      />

      {/* Items area */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        width: "100%",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 24,
          border: "3px solid #E0E0E0",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          padding: "clamp(14px,4vw,24px)",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "center",
          gap: "clamp(6px,2vw,12px)",
          minHeight: "clamp(100px,28vw,160px)",
          minWidth: "clamp(200px,60vw,340px)",
          maxWidth: 380,
        }}>
          {displayItems.map((item, i) => {
            const isActive = i === activeIdx;
            return (
              <div key={i} style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: isActive ? "var(--primary)" : "var(--accent)",
                borderRadius: 14,
                width: "clamp(52px,14vw,72px)", height: "clamp(52px,14vw,72px)",
                transform: isActive ? "scale(1.2)" : "scale(1)",
                transition: "transform 0.2s, background 0.2s",
                boxShadow: isActive ? "0 4px 12px rgba(255,107,53,0.4)" : "0 3px 0 rgba(0,0,0,0.08)",
              }}>
                <span style={{ fontSize: "clamp(1.6rem,8vw,2.5rem)", lineHeight: 1 }}>{item.emoji}</span>
              </div>
            );
          })}

          {/* Placeholder slots for unrevealed items */}
          {phase === "reveal" && Array.from({ length: round.count - revealed }, (_, i) => (
            <div key={`ph-${i}`} style={{
              width: "clamp(52px,14vw,72px)", height: "clamp(52px,14vw,72px)",
              background: "#F0F0F0", borderRadius: 14,
              border: "2px dashed #CCC",
            }}/>
          ))}
        </div>
      </div>

      {/* Bottom: reveal button or number options */}
      {phase === "reveal" ? (
        <BottomBar onBack={onBack}>
          {revealed < round.count ? (
            <button className="btn btn-bar" onClick={revealNext}>
              {revealed === 0 ? "Начать →" : `Ещё → (${revealed}/${round.count})`}
            </button>
          ) : (
            <div style={{ flex: 1, textAlign: "center", fontWeight: 700, color: "var(--muted)" }}>
              Считаем…
            </div>
          )}
        </BottomBar>
      ) : (
        <div style={{
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "center",
          width: "100%", gap: "clamp(10px,3vw,16px)", maxWidth: 380,
          paddingBottom: "clamp(8px,2vw,16px)",
        }}>
          {options.map(n => {
            const isChosen = chosen === n;
            const bg = isChosen
              ? (answerState === "correct" ? "var(--green)" : "var(--red)")
              : "var(--primary)";
            return (
              <button key={n}
                onClick={() => handleAnswer(n)}
                style={{
                  flex: "1 1 calc(50% - 8px)", minWidth: 90, maxWidth: 170, aspectRatio: "1/1",
                  background: bg, border: "none", borderRadius: 20,
                  color: "#fff", fontSize: "clamp(2.2rem,12vw,4rem)", fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: isChosen ? "none" : "0 6px 0 var(--primary-d)",
                  transform: isChosen ? "scale(0.93) translateY(4px)" : "scale(1)",
                  transition: "transform 0.15s, background 0.2s",
                  animation: isChosen && answerState === "wrong" ? "shake 0.5s" : "none",
                }}>
                {n}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
