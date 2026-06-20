import { useState, useEffect, useRef } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { speak, speakSequence, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const BASKET_COLORS  = ["#4ECDC4", "#FF8F00", "#9C27B0"];
const BASKET_SHADOWS = ["#3DB8B0", "#E55A00", "#7B1FA2"];

function buildPool(groups) {
  return shuffle(groups.flatMap(g => g.items.map(item => ({ item, groupId: g.id }))));
}

function ItemContent({ item }) {
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
  return <span style={{ fontSize: "clamp(3.5rem,20vw,7rem)", lineHeight: 1 }}>{item.emoji}</span>;
}

export default function GameStreamSortScreen({ config, groups, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const [pool, setPool]       = useState(() => buildPool(groups));
  const [idx, setIdx]         = useState(0);
  const [shaking, setShaking] = useState(false);
  const [flash, setFlash]     = useState(null);
  const [visible, setVisible] = useState(true);
  const [score, setScore]     = useState(0);
  const [streak, setStreak]   = useState(0);
  const [nextDisabled, setNextDisabled] = useState(false);

  const current = pool[idx % pool.length];
  const task = "Выбери правильную категорию";

  const introRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!introRef.current) {
        introRef.current = true;
        speakSequence(task, current.item.name);
      } else {
        speak(current.item.name);
      }
    }, 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  useEffect(() => {
    if (idx > 0 && idx % pool.length === 0) {
      setPool(buildPool(groups));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  function handleBasket(groupId) {
    if (shaking || !visible) return;
    const isCorrect = current.groupId === groupId;

    if (isCorrect) {
      playSuccess();
      setFlash(groupId);
      setVisible(false);
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(() => { setIdx(i => i + 1); setFlash(null); setVisible(true); }, 500);
    } else {
      playError();
      setStreak(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  }

  function handleSkip() {
    if (nextDisabled) return;
    setNextDisabled(true);
    setTimeout(() => setNextDisabled(false), 500);
    setVisible(false);
    setTimeout(() => { setIdx(i => i + 1); setVisible(true); }, 300);
  }

  const isThree = groups.length >= 3;

  return (
    <div className="screen" style={{ justifyContent: "space-between", gap: 0 }}>
      <GameHeader label={label} record={record} streak={streak}/>

      <RoundTitle title={task} subtitle={`Отсортировано: ${score}`}/>

      {/* Current item */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "#fff", borderRadius: 28,
          width: "clamp(180px,54vw,270px)", aspectRatio: "1/1",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 10px 0 rgba(0,0,0,0.10)",
          opacity: visible ? 1 : 0,
          transform: visible
            ? (shaking ? undefined : "scale(1)")
            : "scale(0.7) translateY(-20px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          animation: shaking ? "shake 0.5s" : "none",
          overflow: "hidden",
        }}>
          <ItemContent item={current.item}/>
          <span style={{
            fontSize: "clamp(0.75rem,2.5vw,1rem)", fontWeight: 800,
            color: "var(--text)", textAlign: "center", paddingInline: 8, lineHeight: 1.2,
          }}>
            {current.item.name}
          </span>
        </div>
      </div>

      {/* Baskets */}
      <div style={{
        display: "flex", gap: "clamp(8px,2.5vw,16px)",
        width: "100%", maxWidth: isThree ? 560 : 500, paddingBottom: 8, marginBottom: 12,
      }}>
        {groups.map((grp, i) => {
          const isFlash = flash === grp.id;
          const color = BASKET_COLORS[i] ?? BASKET_COLORS[0];
          const shadow = BASKET_SHADOWS[i] ?? BASKET_SHADOWS[0];
          return (
            <button key={grp.id} onClick={() => handleBasket(grp.id)} style={{
              flex: 1,
              padding: isThree ? "clamp(10px,2.5vw,16px) 4px" : "clamp(14px,3vw,20px) 8px",
              background: isFlash ? "var(--green)" : color,
              border: "none", borderRadius: 20,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 4,
              cursor: "pointer",
              boxShadow: isFlash ? "0 4px 0 #3d9140" : `0 6px 0 ${shadow}`,
              transform: isFlash ? "scale(1.06)" : "scale(1)",
              transition: "background 0.2s, transform 0.15s",
            }}>
              <span style={{ fontSize: isThree ? "clamp(1.6rem,7vw,2.4rem)" : "clamp(2rem,10vw,3rem)" }}>🧺</span>
              <span style={{
                fontSize: isThree ? "clamp(0.6rem,2vw,0.8rem)" : "clamp(0.8rem,2.8vw,1.1rem)",
                fontWeight: 800, color: "#fff", textAlign: "center", lineHeight: 1.2,
              }}>
                {grp.label}
              </span>
            </button>
          );
        })}
      </div>

      <BottomBar onBack={onBack}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => speak(current.item.name)}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSkip} disabled={nextDisabled}>Пропустить ➡️</button>
      </BottomBar>
    </div>
  );
}
