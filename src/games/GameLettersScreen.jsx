import { useState, useEffect } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { speak, playSuccess } from "../lib/audio";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

// Тренировка звука: сначала сам звук, потом слоги
export default function GameLettersScreen({ config, sound, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  // Элементы тренировки: буква → слоги
  const items = [sound.letter, ...sound.syllables];
  const [idx, setIdx]     = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const current = items[idx % items.length];
  const isLetter = idx % items.length === 0;

  function sayCurrent() {
    speak(isLetter ? sound.pronounce : current.toLowerCase());
  }

  useEffect(() => {
    const t = setTimeout(sayCurrent, 400);
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
      <RoundTitle
        title={isLetter ? "Повтори звук!" : "Повтори слог!"}
        subtitle={`Звук «${sound.letter}» · ${(idx % items.length) + 1} из ${items.length}`}
      />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "#fff", borderRadius: 32,
          width: "clamp(200px,62vw,300px)", aspectRatio: "1/1",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 10px 0 rgba(0,0,0,0.10)",
        }}>
          <span style={{
            fontSize: isLetter ? "clamp(7rem,42vw,12rem)" : "clamp(4rem,24vw,7rem)",
            fontWeight: 900, color: "var(--primary)", lineHeight: 1, letterSpacing: "0.02em",
          }}>
            {current}
          </span>
        </div>
      </div>

      <BottomBar onBack={onBack}>
        <button className="btn btn-bar" onClick={sayCurrent}>🔊 Повторить</button>
        <button className="btn btn-bar" onClick={handleDone}>✓ Получилось</button>
      </BottomBar>
    </div>
  );
}
