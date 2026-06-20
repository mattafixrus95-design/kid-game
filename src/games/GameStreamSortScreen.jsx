import { useState, useEffect, useCallback } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { speak, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import BottomBar from "../components/BottomBar";

function buildPool(groupA, groupB) {
  const a = groupA.items.map(item => ({ item, group: "a" }));
  const b = groupB.items.map(item => ({ item, group: "b" }));
  return shuffle([...a, ...b]);
}

const BASKET_COLORS = {
  a: "#4ECDC4",
  b: "#FF8F00",
};

export default function GameStreamSortScreen({ config, groupA, groupB, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const [pool, setPool]           = useState(() => buildPool(groupA, groupB));
  const [idx, setIdx]             = useState(0);
  const [shaking, setShaking]     = useState(false);
  const [flash, setFlash]         = useState(null);  // "a" | "b" | null
  const [visible, setVisible]     = useState(true);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);

  const current = pool[idx % pool.length];

  // Announce item on change
  useEffect(() => {
    const t = setTimeout(() => speak(config.getName(current.item)), 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // Rebuild & reshuffle pool when exhausted
  useEffect(() => {
    if (idx > 0 && idx % pool.length === 0) {
      setPool(buildPool(groupA, groupB));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  function handleBasket(basket) {
    if (shaking || !visible) return;
    const isCorrect = current.group === basket;

    if (isCorrect) {
      playSuccess();
      setFlash(basket);
      setVisible(false);
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(() => {
        setIdx(i => i + 1);
        setFlash(null);
        setVisible(true);
      }, 500);
    } else {
      playError();
      setStreak(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  }

  const groups = { a: groupA, b: groupB };

  return (
    <div className="screen" style={{ justifyContent: "space-between", gap: 0 }}>
      <GameHeader label={label} record={record} streak={streak}/>

      {/* Score bar */}
      <div style={{
        display: "flex", gap: 8, alignItems: "center", justifyContent: "center",
        fontSize: "clamp(0.9rem,3vw,1.1rem)", fontWeight: 700, color: "var(--muted)",
      }}>
        Отсортировано: {score}
      </div>

      {/* Current item */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: "var(--accent)", borderRadius: 28,
          width: "clamp(170px,52vw,260px)", aspectRatio: "1/1",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 10,
          boxShadow: "0 10px 0 rgba(0,0,0,0.12)",
          opacity: visible ? 1 : 0,
          transform: visible
            ? (shaking ? undefined : "scale(1)")
            : "scale(0.7) translateY(-20px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          animation: shaking ? "shake 0.5s" : "none",
        }}>
          <span style={{ fontSize: "clamp(4rem,22vw,7rem)", lineHeight: 1 }}>
            {current.item.emoji}
          </span>
          <span style={{
            fontSize: "clamp(1rem,4vw,1.5rem)", fontWeight: 800,
            color: "#fff", textAlign: "center", paddingInline: 8,
          }}>
            {config.getName(current.item)}
          </span>
        </div>
      </div>

      {/* Baskets */}
      <div style={{
        display: "flex", gap: "clamp(10px,3vw,20px)",
        width: "100%", maxWidth: 500, paddingBottom: 8,
      }}>
        {(["a", "b"]).map(key => {
          const grp = groups[key];
          const isFlash = flash === key;
          const color = BASKET_COLORS[key];
          return (
            <button key={key}
              onClick={() => handleBasket(key)}
              style={{
                flex: 1, padding: "clamp(14px,3vw,20px) 8px",
                background: isFlash ? "var(--green)" : color,
                border: "none", borderRadius: 20,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
                cursor: "pointer",
                boxShadow: isFlash
                  ? "0 4px 0 #3d9140"
                  : `0 6px 0 ${color}99`,
                transform: isFlash ? "scale(1.06)" : "scale(1)",
                transition: "background 0.2s, transform 0.15s",
              }}>
              <span style={{ fontSize: "clamp(2rem,10vw,3rem)" }}>🧺</span>
              <span style={{
                fontSize: "clamp(0.8rem,2.8vw,1.1rem)", fontWeight: 800,
                color: "#fff", textAlign: "center", lineHeight: 1.2,
              }}>
                {grp.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
