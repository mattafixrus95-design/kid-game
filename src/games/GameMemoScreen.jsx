import { useState, useEffect, useRef, useCallback } from "react";
import { playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const PAIR_COUNT = 6;
const FLIP_BACK_DELAY = 900;
const SUCCESS_ADVANCE_DELAY = 600;

function buildCards(items) {
  const pool = shuffle([...items]).slice(0, Math.min(PAIR_COUNT, items.length));
  const pairs = shuffle([
    ...pool.map((item, i) => ({ uid: `a${i}`, item })),
    ...pool.map((item, i) => ({ uid: `b${i}`, item })),
  ]);
  return pairs.map(c => ({ ...c, flipped: false, matched: false }));
}

const CARD_BACK = "#6C63FF";

export default function GameMemoScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const [cards, setCards]     = useState(() => buildCards(items));
  const [open, setOpen]       = useState([]);   // indices of currently open unmatched cards
  const [locked, setLocked]   = useState(false);
  const [moves, setMoves]     = useState(0);
  const [score, setScore]     = useState(0);
  const [streak, setStreak]   = useState(0);
  const [done, setDone]       = useState(false);

  const totalPairs = cards.length / 2;

  const matchedCount = cards.filter(c => c.matched).length / 2;

  const restart = useCallback(() => {
    setCards(buildCards(items));
    setOpen([]);
    setLocked(false);
    setMoves(0);
    setDone(false);
  }, [items]);

  function handleCard(idx) {
    if (locked) return;
    const card = cards[idx];
    if (card.flipped || card.matched) return;
    if (open.length === 1 && open[0] === idx) return;

    const newOpen = [...open, idx];
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));

    if (newOpen.length < 2) {
      setOpen(newOpen);
      return;
    }

    // Two cards open — check match
    setLocked(true);
    setMoves(m => m + 1);

    const [ai, bi] = newOpen;
    const a = cards[ai], b = cards[bi];
    const isMatch = config.getKey(a.item) === config.getKey(b.item);

    if (isMatch) {
      playSuccess();
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);

      setCards(prev => prev.map((c, i) =>
        i === ai || i === bi ? { ...c, flipped: true, matched: true } : c
      ));
      setOpen([]);
      setLocked(false);

      if (matchedCount + 1 === totalPairs) {
        setTimeout(() => setDone(true), SUCCESS_ADVANCE_DELAY);
      }
    } else {
      playError();
      setStreak(0);
      setTimeout(() => {
        setCards(prev => prev.map((c, i) =>
          i === ai || i === bi ? { ...c, flipped: false } : c
        ));
        setOpen([]);
        setLocked(false);
      }, FLIP_BACK_DELAY);
    }
  }

  const cols = 4;

  if (done) return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontSize: "clamp(3rem,16vw,6rem)" }}>🎉</div>
        <div style={{ fontSize: "clamp(1.4rem,5vw,2rem)", fontWeight: 900, color: "var(--text)", textAlign: "center" }}>
          Все пары найдены!
        </div>
        <div style={{ fontSize: "clamp(1rem,3.5vw,1.4rem)", color: "var(--text-muted, #888)", fontWeight: 700 }}>
          Ходов: {moves}
        </div>
      </div>
      <BottomBar>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={restart}>
          Ещё раз ➡️
        </button>
      </BottomBar>
    </div>
  );

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle
        title="Мемори"
        subtitle={`Найди пары · ${matchedCount} / ${totalPairs}`}
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "clamp(6px,2vw,12px)",
        width: "100%",
        maxWidth: 480,
        padding: "0 4px",
      }}>
        {cards.map((card, idx) => (
          <MemoCard
            key={card.uid}
            card={card}
            config={config}
            onClick={() => handleCard(idx)}
          />
        ))}
      </div>

      <BottomBar>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={restart}>🔄 Заново</button>
      </BottomBar>
    </div>
  );
}

function MemoCard({ card, config, onClick }) {
  const { flipped, matched } = card;
  const isOpen = flipped || matched;

  return (
    <div
      onClick={onClick}
      style={{
        aspectRatio: "1/1",
        perspective: 600,
        cursor: isOpen ? "default" : "pointer",
      }}
    >
      <div style={{
        width: "100%",
        height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        transform: isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Back (closed) */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: matched ? "var(--green)" : CARD_BACK,
          borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 0 rgba(0,0,0,0.12)",
          fontSize: "clamp(1.2rem,6vw,2rem)",
          transition: "background 0.3s",
        }}>
          🃏
        </div>

        {/* Front (open) */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: matched ? "var(--green)" : "var(--accent)",
          borderRadius: 14,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 2,
          boxShadow: matched ? "0 4px 0 rgba(0,0,0,0.10)" : "0 4px 0 rgba(0,0,0,0.12)",
          overflow: "hidden",
          padding: 4,
        }}>
          <div style={{ fontSize: "clamp(1.4rem,8vw,2.8rem)", lineHeight: 1 }}>
            {card.item.emoji ?? config.renderLearn(card.item)}
          </div>
          <div style={{ fontSize: "clamp(0.55rem,1.8vw,0.8rem)", fontWeight: 700, color: "#fff", textAlign: "center", lineHeight: 1.2 }}>
            {config.getName(card.item)}
          </div>
        </div>
      </div>
    </div>
  );
}
