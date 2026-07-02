import { useState, useEffect, useRef, useCallback } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { speak, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import BottomBar from "../components/BottomBar";

const GRID_SIZE  = 16;   // 4×4
const TARGET_COUNT = 3;  // targets hidden in grid
const ROUND_TIME = 20;   // seconds per round

function buildGrid(items, target) {
  const targetKey = target.name;
  const distractors = items.filter(i => i.name !== targetKey);
  const positions = shuffle([...Array(GRID_SIZE).keys()]);
  const targetPositions = new Set(positions.slice(0, TARGET_COUNT));

  const distractorPool = shuffle([...distractors, ...distractors, ...distractors]);

  return Array.from({ length: GRID_SIZE }, (_, i) => ({
    id: i,
    item: targetPositions.has(i) ? target : distractorPool[i % distractorPool.length],
    isTarget: targetPositions.has(i),
    found: false,
    shake: false,
  }));
}

function pickTarget(items, prevName) {
  const pool = items.filter(i => i.name !== prevName);
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : items[0];
}

export default function GameFastFindScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const [target, setTarget]   = useState(() => pickTarget(items, null));
  const [grid, setGrid]       = useState(() => buildGrid(items, pickTarget(items, null)));
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [found, setFound]     = useState(0);      // targets found this round
  const [totalFound, setTotalFound] = useState(0); // all-time score
  const [streak, setStreak]   = useState(0);
  const [phase, setPhase]     = useState("play"); // "play" | "result"
  const [roundScore, setRoundScore] = useState(0);

  const timerRef = useRef(null);
  const targetRef = useRef(target);
  const foundRef = useRef(0);

  // Keep refs in sync
  useEffect(() => { targetRef.current = target; }, [target]);

  function startRound(prevTargetName) {
    const t = pickTarget(items, prevTargetName);
    setTarget(t);
    targetRef.current = t;
    setGrid(buildGrid(items, t));
    setTimeLeft(ROUND_TIME);
    setFound(0);
    foundRef.current = 0;
    setPhase("play");
    speak(`Найди: ${t.name}`);
  }

  // Timer
  useEffect(() => {
    if (phase !== "play") return;
    speak(`Найди: ${target.name}`);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase("result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, target]);

  function handleTap(idx) {
    if (phase !== "play") return;
    setGrid(prev => {
      const cell = prev[idx];
      if (cell.found) return prev;

      if (cell.isTarget) {
        playSuccess();
        const next = prev.map((c, i) => i === idx ? { ...c, found: true } : c);
        const newFound = foundRef.current + 1;
        foundRef.current = newFound;
        setFound(newFound);
        const ns = totalFound + 1;
        setTotalFound(ns);
        setStreak(s => s + 1);
        if (ns > record) onUpdateRecord(ns);

        // All targets found — advance round
        if (newFound >= TARGET_COUNT) {
          clearInterval(timerRef.current);
          setRoundScore(s => s + 1);
          setTimeout(() => startRound(targetRef.current.name), 600);
        }
        return next;
      } else {
        playError();
        setStreak(0);
        // Shake the cell briefly
        const next = prev.map((c, i) => i === idx ? { ...c, shake: true } : c);
        setTimeout(() => {
          setGrid(g => g.map((c, i) => i === idx ? { ...c, shake: false } : c));
        }, 500);
        return next;
      }
    });
  }

  const timerFraction = timeLeft / ROUND_TIME;
  const timerColor = timerFraction > 0.5 ? "var(--green)" : timerFraction > 0.25 ? "#FF8F00" : "var(--red)";

  if (phase === "result") return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ fontSize: "clamp(3rem,16vw,6rem)" }}>⏰</div>
        <div style={{ fontSize: "clamp(1.3rem,5vw,1.9rem)", fontWeight: 900, color: "var(--text)", textAlign: "center" }}>
          Время вышло!
        </div>
        <div style={{ fontSize: "clamp(1rem,4vw,1.4rem)", fontWeight: 700, color: "var(--muted)", textAlign: "center" }}>
          Найдено раундов: {roundScore}
        </div>
      </div>
      <BottomBar onBack={onBack}>
        <button className="btn btn-bar" onClick={() => {
          setRoundScore(0);
          setTotalFound(0);
          startRound(null);
        }}>Ещё раз →</button>
      </BottomBar>
    </div>
  );

  return (
    <div className="screen" style={{ justifyContent: "space-between", gap: "clamp(6px,2vw,12px)" }}>
      <GameHeader label={label} record={record} streak={streak}/>

      {/* Target + Timer */}
      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Target banner */}
        <div style={{
          background: "var(--primary)", borderRadius: 16, padding: "10px 20px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <span style={{ fontSize: "clamp(0.95rem,3.5vw,1.2rem)", fontWeight: 800, color: "#fff" }}>Найди:</span>
          <span style={{ fontSize: "clamp(2rem,10vw,3rem)", lineHeight: 1 }}>{target.emoji}</span>
          <span style={{ fontSize: "clamp(1rem,3.5vw,1.3rem)", fontWeight: 800, color: "#fff" }}>{target.name}</span>
          <button
            onClick={() => speak(`Найди: ${target.name}`)}
            style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", color: "#fff", fontSize: "1.1rem" }}
          >🔊</button>
        </div>

        {/* Timer bar */}
        <div style={{ width: "100%", height: 8, background: "#E0E0E0", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            width: `${timerFraction * 100}%`, height: "100%",
            background: timerColor,
            borderRadius: 99,
            transition: "width 1s linear, background 0.3s",
          }}/>
        </div>
        <div style={{ textAlign: "center", fontSize: "clamp(0.85rem,3vw,1.1rem)", fontWeight: 700, color: timerColor }}>
          {timeLeft}с · найдено: {found} / {TARGET_COUNT}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "clamp(5px,1.5vw,10px)",
        width: "100%",
        maxWidth: 480,
        flex: 1,
        alignContent: "center",
      }}>
        {grid.map(cell => (
          <button
            key={cell.id}
            onClick={() => handleTap(cell.id)}
            style={{
              aspectRatio: "1/1",
              background: cell.found ? "var(--green)" : "var(--accent)",
              border: "none", borderRadius: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: cell.found ? "default" : "pointer",
              boxShadow: "0 3px 0 rgba(0,0,0,0.10)",
              opacity: cell.found ? 0.5 : 1,
              transform: cell.found ? "scale(0.85)" : "scale(1)",
              transition: "opacity 0.3s, transform 0.2s, background 0.2s",
              animation: cell.shake ? "shake 0.45s" : "none",
            }}
          >
            <span style={{ fontSize: "clamp(1.4rem,7vw,2.2rem)", lineHeight: 1 }}>
              {cell.item.emoji}
            </span>
          </button>
        ))}
      </div>

      <div style={{ height: 4 }}/>
    </div>
  );
}
