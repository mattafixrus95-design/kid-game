import { useState, useEffect, useCallback } from "react";
import { playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const SEQ_LEN = 3;
const SHOW_DURATION = 1200; // ms per item in auto-show

function generateRound(items) {
  const pool = shuffle([...items]);
  const sequence = pool.slice(0, SEQ_LEN);
  // Distractors: items not in sequence
  const distractors = shuffle(pool.filter(it => !sequence.includes(it))).slice(0, 3);
  const options = shuffle([...sequence, ...distractors]);
  return { sequence, options };
}

export default function GameSequenceScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const [round, setRound]         = useState(() => generateRound(items));
  const [phase, setPhase]         = useState("show");   // "show" | "quiz"
  const [showIdx, setShowIdx]     = useState(0);        // which item is shown in show-phase
  const [visible, setVisible]     = useState(true);     // fade state
  const [chosen, setChosen]       = useState([]);       // keys in tap order
  const [shaking, setShaking]     = useState(false);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);

  // Auto-advance show phase
  useEffect(() => {
    if (phase !== "show") return;
    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), SHOW_DURATION);
    const nextTimer = setTimeout(() => {
      if (showIdx + 1 < round.sequence.length) {
        setShowIdx(i => i + 1);
      } else {
        // Done showing — transition to quiz
        setPhase("quiz");
      }
    }, SHOW_DURATION + 350);
    return () => { clearTimeout(hideTimer); clearTimeout(nextTimer); };
  }, [phase, showIdx, round]);

  function advanceRound() {
    const next = generateRound(items);
    setRound(next);
    setPhase("show");
    setShowIdx(0);
    setVisible(true);
    setChosen([]);
    setShaking(false);
  }

  function handleOption(item) {
    if (phase !== "quiz") return;
    const key = config.getKey(item);
    if (chosen.includes(key)) return;

    const nextChosen = [...chosen, key];
    const expectedKey = config.getKey(round.sequence[chosen.length]);

    if (key !== expectedKey) {
      // Wrong item or wrong order
      playError();
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        setChosen([]);
      }, 600);
      return;
    }

    setChosen(nextChosen);

    if (nextChosen.length === round.sequence.length) {
      // All correct
      playSuccess();
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(advanceRound, 900);
    }
  }

  const currentItem = round.sequence[showIdx];

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>

      {phase === "show" ? (
        <>
          <RoundTitle title="Запомни порядок!" subtitle={`${showIdx + 1} из ${round.sequence.length}`}/>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              background: "var(--accent)", borderRadius: 24,
              width: "clamp(160px,50vw,240px)", aspectRatio: "1/1",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 8px 0 rgba(0,0,0,0.12)",
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.85)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}>
              <span style={{ fontSize: "clamp(4rem,22vw,7rem)" }}>{currentItem.emoji}</span>
              <span style={{ fontSize: "clamp(1rem,4vw,1.5rem)", fontWeight: 800, color: "#fff", textAlign: "center" }}>
                {config.getName(currentItem)}
              </span>
            </div>
          </div>
          {/* Dot indicators */}
          <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            {round.sequence.map((_, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: "50%",
                background: i <= showIdx ? "var(--primary)" : "#D0D0D0",
                transition: "background 0.3s",
              }}/>
            ))}
          </div>
          <BottomBar>
            <div style={{ flex: 1, textAlign: "center", color: "#888", fontSize: "0.95rem", fontWeight: 700 }}>
              Смотри внимательно…
            </div>
          </BottomBar>
        </>
      ) : (
        <>
          <RoundTitle
            title="Повтори по порядку!"
            subtitle={`${chosen.length} / ${round.sequence.length}`}
          />

          {/* Chosen order preview */}
          <div style={{
            display: "flex", gap: 8, alignItems: "center", justifyContent: "center",
            minHeight: 52,
          }}>
            {round.sequence.map((_, i) => {
              const chosenKey = chosen[i];
              const item = chosenKey ? round.options.find(o => config.getKey(o) === chosenKey) : null;
              return (
                <div key={i} style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: item ? "var(--primary)" : "rgba(0,0,0,0.08)",
                  border: item ? "none" : "2px dashed #CCC",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.6rem",
                  transition: "background 0.2s",
                }}>
                  {item ? item.emoji : ""}
                </div>
              );
            })}
          </div>

          {/* Options grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(8px,2.5vw,14px)",
            width: "100%", maxWidth: 480,
            animation: shaking ? "shake 0.5s" : "none",
          }}>
            {round.options.map(item => {
              const key = config.getKey(item);
              const chosenPos = chosen.indexOf(key);
              const isPicked = chosenPos !== -1;
              return (
                <button key={key}
                  onClick={() => handleOption(item)}
                  style={{
                    aspectRatio: "1/1",
                    background: isPicked ? "var(--green)" : "var(--accent)",
                    border: "3px solid transparent",
                    borderRadius: 18,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 4,
                    cursor: isPicked ? "default" : "pointer",
                    boxShadow: "0 4px 0 rgba(0,0,0,0.10)",
                    transform: isPicked ? "scale(0.93)" : "scale(1)",
                    transition: "transform 0.15s, background 0.2s",
                    position: "relative",
                  }}>
                  {isPicked && (
                    <div style={{
                      position: "absolute", top: 6, right: 8,
                      background: "rgba(0,0,0,0.25)", borderRadius: 99,
                      width: 22, height: 22,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 900, color: "#fff",
                    }}>
                      {chosenPos + 1}
                    </div>
                  )}
                  <span style={{ fontSize: "clamp(2rem,10vw,3.5rem)" }}>{item.emoji}</span>
                  <span style={{ fontSize: "clamp(0.65rem,2vw,0.9rem)", fontWeight: 700, color: "#fff", textAlign: "center" }}>
                    {config.getName(item)}
                  </span>
                </button>
              );
            })}
          </div>

          <BottomBar>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setChosen([])}>
              ↩️ Сбросить
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={advanceRound}>
              Пропустить ➡️
            </button>
          </BottomBar>
        </>
      )}
    </div>
  );
}
