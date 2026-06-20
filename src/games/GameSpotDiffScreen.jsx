import { useState, useCallback } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const SCENE_SIZE = 6; // 3 cols × 2 rows per panel

function generateScene(items) {
  const pool = shuffle([...items]);
  const left = pool.slice(0, Math.min(SCENE_SIZE, pool.length));

  // Pad if fewer than SCENE_SIZE items
  while (left.length < SCENE_SIZE) left.push(left[left.length - 1]);

  const extra = pool.slice(left.length).filter(Boolean);
  // If not enough extras, reuse items from left that aren't already there
  if (extra.length === 0) {
    const alt = items.find(it => it.name !== left[0].name);
    if (alt) extra.push(alt);
  }

  const diffCount = Math.min(extra.length >= 2 ? 2 : 1, extra.length);
  const diffPositions = shuffle([...Array(left.length).keys()]).slice(0, diffCount);

  const right = [...left];
  diffPositions.forEach((pos, i) => { right[pos] = extra[i % extra.length]; });

  return { left, right, diffSet: new Set(diffPositions) };
}

export default function GameSpotDiffScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const [scene, setScene]         = useState(() => generateScene(items));
  const [found, setFound]         = useState(new Set());   // positions found
  const [wrong, setWrong]         = useState(null);        // position shaking
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [done, setDone]           = useState(false);

  const advanceRound = useCallback(() => {
    setScene(generateScene(items));
    setFound(new Set());
    setWrong(null);
    setDone(false);
  }, [items]);

  function handleRightTap(pos) {
    if (found.has(pos) || wrong === pos || done) return;

    if (scene.diffSet.has(pos)) {
      playSuccess();
      const nextFound = new Set(found).add(pos);
      setFound(nextFound);
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      if (nextFound.size === scene.diffSet.size) {
        setTimeout(() => setDone(true), 500);
      }
    } else {
      playError();
      setStreak(0);
      setWrong(pos);
      setTimeout(() => setWrong(null), 600);
    }
  }

  const cols = 3;
  const cellSize = "clamp(50px,13vw,72px)";

  function renderGrid(itemList, interactive) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cellSize})`,
        gap: "clamp(4px,1.5vw,8px)",
      }}>
        {itemList.map((item, pos) => {
          const isFound   = interactive && found.has(pos);
          const isWrong   = interactive && wrong === pos;
          const isDiff    = interactive && scene.diffSet.has(pos);

          let bg = "var(--accent)";
          if (isFound) bg = "var(--green)";
          else if (isWrong) bg = "var(--red)";

          return (
            <div
              key={pos}
              onClick={interactive ? () => handleRightTap(pos) : undefined}
              style={{
                width: cellSize, height: cellSize,
                background: bg,
                borderRadius: 12,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                cursor: interactive && !isFound ? "pointer" : "default",
                boxShadow: isFound ? "0 0 0 3px var(--green)" : "0 3px 0 rgba(0,0,0,0.10)",
                transform: isWrong ? undefined : isFound ? "scale(1.06)" : "scale(1)",
                transition: "background 0.2s, transform 0.15s",
                animation: isWrong ? "shake 0.5s" : "none",
                gap: 2,
              }}
            >
              <span style={{ fontSize: "clamp(1.4rem,7vw,2.2rem)", lineHeight: 1 }}>{item.emoji}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (done) return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontSize: "clamp(3rem,16vw,6rem)" }}>🎉</div>
        <div style={{ fontSize: "clamp(1.3rem,5vw,1.9rem)", fontWeight: 900, color: "var(--text)", textAlign: "center" }}>
          Все отличия найдены!
        </div>
      </div>
      <BottomBar onBack={onBack}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={advanceRound}>Ещё раз ➡️</button>
      </BottomBar>
    </div>
  );

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>
      <RoundTitle
        title="Найди отличие"
        subtitle={`Найдено: ${found.size} / ${scene.diffSet.size}`}
      />

      {/* Two panels */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        gap: "clamp(10px,3vw,20px)", width: "100%",
      }}>
        {/* Left panel — original */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{
            fontSize: "clamp(0.7rem,2.5vw,0.9rem)", fontWeight: 700,
            color: "var(--muted)", letterSpacing: "0.03em",
          }}>
            ОРИГИНАЛ
          </div>
          <div style={{
            padding: "clamp(6px,2vw,10px)",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            border: "2px solid #E0E0E0",
          }}>
            {renderGrid(scene.left, false)}
          </div>
        </div>

        {/* Right panel — modified, interactive */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{
            fontSize: "clamp(0.7rem,2.5vw,0.9rem)", fontWeight: 700,
            color: "var(--primary)", letterSpacing: "0.03em",
          }}>
            НАЙДИ ↓
          </div>
          <div style={{
            padding: "clamp(6px,2vw,10px)",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            border: "2px solid var(--primary)",
          }}>
            {renderGrid(scene.right, true)}
          </div>
        </div>
      </div>

      <BottomBar onBack={onBack}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={advanceRound}>Пропустить ➡️</button>
      </BottomBar>
    </div>
  );
}
