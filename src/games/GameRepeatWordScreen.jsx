import { useState, useEffect } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { speak, playSuccess } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

// Слово с подсветкой тренируемой буквы
function HighlightedWord({ word, letter }) {
  const target = letter.toLowerCase();
  return (
    <span style={{
      fontSize: "clamp(2.2rem,11vw,3.6rem)", fontWeight: 900,
      color: "var(--text)", lineHeight: 1.1, textAlign: "center",
    }}>
      {word.split("").map((ch, i) =>
        ch.toLowerCase() === target
          ? <span key={i} style={{ color: "var(--primary)" }}>{ch}</span>
          : <span key={i}>{ch}</span>
      )}
    </span>
  );
}

export default function GameRepeatWordScreen({ config, sound, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const [order, setOrder]   = useState(() => shuffle([...sound.words]));
  const [idx, setIdx]       = useState(0);
  const [score, setScore]   = useState(0);
  const [streak, setStreak] = useState(0);

  const current = order[idx % order.length];

  useEffect(() => {
    if (idx > 0 && idx % order.length === 0) setOrder(shuffle([...sound.words]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  useEffect(() => {
    const t = setTimeout(() => speak(current.name), 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  function handleDone() {
    playSuccess();
    const ns = score + 1, nst = streak + 1;
    setScore(ns); setStreak(nst);
    if (ns > record) onUpdateRecord(ns);
    setTimeout(() => setIdx(i => i + 1), 400);
  }

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>
      <RoundTitle title="Повтори слово!" subtitle={`Звук «${sound.letter}»`}/>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "clamp(14px,4vw,26px)",
      }}>
        <div style={{
          background: "#fff", borderRadius: 32,
          width: "clamp(170px,52vw,250px)", aspectRatio: "1/1",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 10px 0 rgba(0,0,0,0.10)", overflow: "hidden",
        }}>
          {current.image
            ? <img src={current.image} alt={current.name} decoding="sync"
                style={{ width: "82%", height: "82%", objectFit: "contain" }}/>
            : <span style={{ fontSize: "clamp(5rem,30vw,8rem)", lineHeight: 1 }}>{current.emoji}</span>}
        </div>
        <HighlightedWord word={current.name} letter={sound.letter}/>
      </div>

      <BottomBar onBack={onBack}>
        <button className="btn btn-bar" onClick={() => speak(current.name)}>🔊 Повторить</button>
        <button className="btn btn-bar" onClick={handleDone}>✓ Получилось</button>
      </BottomBar>
    </div>
  );
}
