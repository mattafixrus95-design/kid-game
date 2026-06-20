import { useState, useEffect, useCallback } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const SEQ_LEN = 3;
const SHOW_DURATION = 1200;

function generateRound(items) {
  const pool = shuffle([...items]);
  const sequence = pool.slice(0, SEQ_LEN);
  const distractors = shuffle(pool.filter(it => !sequence.includes(it))).slice(0, 3);
  const options = shuffle([...sequence, ...distractors]);
  return { sequence, options };
}

function ItemImage({ item }) {
  if (item.image) {
    return <img src={item.image} alt={item.name} decoding="sync"
      style={{ width: "82%", height: "82%", objectFit: "contain" }}/>;
  }
  if (item.css) {
    return <div style={{
      width: "60%", height: "60%", borderRadius: "50%",
      background: item.css, border: "2px solid rgba(0,0,0,0.1)",
    }}/>;
  }
  return <span style={{ fontSize: "clamp(3rem,15vw,5rem)", lineHeight: 1 }}>{item.emoji}</span>;
}

export default function GameSequenceScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const [round, setRound]     = useState(() => generateRound(items));
  const [phase, setPhase]     = useState("show");
  const [showIdx, setShowIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [chosen, setChosen]   = useState([]);
  const [shaking, setShaking] = useState(false);
  const [locked, setLocked]   = useState(false);
  const [score, setScore]     = useState(0);
  const [streak, setStreak]   = useState(0);

  useEffect(() => {
    if (phase !== "show") return;
    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), SHOW_DURATION);
    const nextTimer = setTimeout(() => {
      if (showIdx + 1 < round.sequence.length) {
        setShowIdx(i => i + 1);
      } else {
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
    setLocked(false);
  }

  function handleOption(item) {
    if (phase !== "quiz" || locked) return;
    const key = config.getKey(item);
    if (chosen.includes(key)) return;

    const nextChosen = [...chosen, key];
    const expectedKey = config.getKey(round.sequence[chosen.length]);

    if (key !== expectedKey) {
      playError();
      setLocked(true);
      setShaking(true);
      setTimeout(() => { setShaking(false); setChosen([]); setLocked(false); }, 500);
      return;
    }

    setChosen(nextChosen);

    if (nextChosen.length === round.sequence.length) {
      playSuccess();
      setLocked(true);
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(advanceRound, 900);
    }
  }

  const currentItem = round.sequence[showIdx];

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>

      {phase === "show" ? (
        <>
          <RoundTitle title="Запомни порядок!" subtitle={`${showIdx + 1} из ${round.sequence.length}`}/>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              background: "#fff", borderRadius: 24,
              width: "clamp(160px,50vw,240px)", aspectRatio: "1/1",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 0 rgba(0,0,0,0.10)",
              overflow: "hidden",
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.85)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}>
              <ItemImage item={currentItem}/>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            {round.sequence.map((_, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: "50%",
                background: i <= showIdx ? "var(--primary)" : "#D0D0D0",
                transition: "background 0.3s",
              }}/>
            ))}
          </div>
          <BottomBar onBack={onBack}>
            <div style={{ flex: 1, textAlign: "center", color: "#888", fontSize: "0.95rem", fontWeight: 700 }}>
              Смотри внимательно…
            </div>
          </BottomBar>
        </>
      ) : (
        <>
          <RoundTitle title="Повтори последовательность!" subtitle={`${chosen.length} / ${round.sequence.length}`}/>

          {/* Chosen order preview */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", minHeight: 60 }}>
            {round.sequence.map((_, i) => {
              const chosenKey = chosen[i];
              const item = chosenKey ? round.options.find(o => config.getKey(o) === chosenKey) : null;
              return (
                <div key={i} style={{
                  width: 54, height: 54, borderRadius: 12,
                  background: item ? "#fff" : "rgba(0,0,0,0.06)",
                  border: item ? "2px solid var(--green)" : "2px dashed #CCC",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                  transition: "background 0.2s",
                }}>
                  {item && <ItemImage item={item}/>}
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
                    background: isPicked ? "rgba(92,184,92,0.15)" : "#fff",
                    border: isPicked ? "3px solid var(--green)" : "3px solid #E0E0E0",
                    borderRadius: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: isPicked ? "default" : "pointer",
                    boxShadow: "0 4px 0 rgba(0,0,0,0.08)",
                    transform: isPicked ? "scale(0.93)" : "scale(1)",
                    transition: "transform 0.15s, background 0.2s",
                    position: "relative", overflow: "hidden",
                  }}>
                  {isPicked && (
                    <div style={{
                      position: "absolute", top: 5, right: 6,
                      background: "var(--green)", borderRadius: 99,
                      width: 22, height: 22,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 900, color: "#fff",
                      zIndex: 1,
                    }}>
                      {chosenPos + 1}
                    </div>
                  )}
                  <ItemImage item={item}/>
                </button>
              );
            })}
          </div>

          <BottomBar onBack={onBack}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setChosen([])}>↩️ Сбросить</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={advanceRound}>Пропустить ➡️</button>
          </BottomBar>
        </>
      )}
    </div>
  );
}
