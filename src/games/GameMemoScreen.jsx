import { useState, useCallback, useEffect } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { speak, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const PAIR_COUNT = 6;
const FLIP_BACK_DELAY = 900;
const CARD_BACK = "#6C63FF";
const INTRO_TEXT = "Запомни карточки и найди пары";

function CardContent({ item, config }) {
  if (item.image) {
    return <img src={item.image} alt={config.getName(item)} decoding="sync"
      style={{ width: "82%", height: "82%", objectFit: "contain" }}/>;
  }
  if (item.css) {
    return <div style={{
      width: "70%", height: "70%", borderRadius: "50%", background: item.css,
      border: "2px solid rgba(0,0,0,0.1)",
    }}/>;
  }
  if (item.emoji) {
    return <span style={{ fontSize: "clamp(2rem,10vw,3.2rem)", lineHeight: 1 }}>{item.emoji}</span>;
  }
  return null;
}

function MemoCard({ card, config, forceOpen, onClick }) {
  const { matched } = card;
  const isOpen = forceOpen || matched || card.flipped;

  return (
    <div onClick={onClick} style={{
      aspectRatio: "1/1", perspective: 600,
      cursor: (forceOpen || matched) ? "default" : "pointer",
    }}>
      <div style={{
        width: "100%", height: "100%", position: "relative",
        transformStyle: "preserve-3d",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        transform: isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
      }}>
        {/* Рубашка */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          background: CARD_BACK, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 0 rgba(0,0,0,0.15)",
          fontSize: "clamp(1rem,4vw,1.5rem)",
        }}>🃏</div>

        {/* Лицо */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "#fff",
          borderRadius: 10,
          border: matched ? "2px solid var(--green)" : "2px solid #E0E0E0",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
          boxShadow: matched ? "0 3px 0 rgba(92,184,92,0.3)" : "0 3px 0 rgba(0,0,0,0.10)",
        }}>
          <CardContent item={card.item} config={config}/>
        </div>
      </div>
    </div>
  );
}

function MemoGrid({ cards, config, phase, onCardClick }) {
  return (
    <div style={{
      width: "min(calc(100vw - 24px), calc((100dvh - 190px) * 4 / 3))",
      aspectRatio: "4/3",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridTemplateRows: "repeat(3, 1fr)",
      gap: "clamp(4px,1.5vw,10px)",
    }}>
      {cards.map((card, idx) => (
        <MemoCard
          key={card.uid}
          card={card}
          config={config}
          forceOpen={phase === "preview" || card.flipped}
          onClick={() => onCardClick(idx)}
        />
      ))}
    </div>
  );
}

function buildCards(items) {
  const pool = shuffle([...items]).slice(0, Math.min(PAIR_COUNT, items.length));
  const pairs = shuffle([
    ...pool.map((item, i) => ({ uid: `a${i}`, item })),
    ...pool.map((item, i) => ({ uid: `b${i}`, item })),
  ]);
  return pairs.map(c => ({ ...c, matched: false }));
}

export default function GameMemoScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const [phase, setPhase]   = useState("preview");
  const [cards, setCards]   = useState(() => buildCards(items));
  const [open, setOpen]     = useState([]);
  const [locked, setLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore]   = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setTimeout(() => speak(INTRO_TEXT), 300);
  }, []);

  const totalPairs   = cards.length / 2;
  const matchedCount = cards.filter(c => c.matched).length / 2;

  const startGame = useCallback(() => setPhase("play"), []);

  const restart = useCallback(() => {
    setCards(buildCards(items));
    setOpen([]);
    setLocked(false);
    setAttempts(0);
    setPhase("preview");
    setTimeout(() => speak(INTRO_TEXT), 300);
  }, [items]);

  function handleCard(idx) {
    if (phase !== "play" || locked) return;
    const card = cards[idx];
    if (card.flipped || card.matched) return;
    if (open.length === 1 && open[0] === idx) return;

    const newOpen = [...open, idx];
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));

    if (newOpen.length < 2) { setOpen(newOpen); return; }

    setLocked(true);
    setAttempts(a => a + 1);

    const [ai, bi] = newOpen;
    const isMatch = config.getKey(cards[ai].item) === config.getKey(cards[bi].item);

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
      if (matchedCount + 1 === totalPairs) setTimeout(() => setPhase("done"), 500);
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

  if (phase === "done") return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "clamp(12px,3vw,24px)" }}>
        <div style={{ fontSize: "clamp(2.5rem,12vw,5rem)", lineHeight: 1 }}>🎉</div>
        <div style={{ fontSize: "clamp(1.3rem,5vw,2rem)", fontWeight: 900, color: "var(--text)", textAlign: "center" }}>Отлично!</div>
        <div style={{ fontSize: "clamp(0.95rem,3vw,1.3rem)", color: "var(--muted)", fontWeight: 700 }}>Попыток: {attempts}</div>
      </div>
      <BottomBar onBack={onBack}>
        <button className="btn btn-bar" onClick={restart}>Далее →</button>
      </BottomBar>
    </div>
  );

  if (phase === "preview") return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>
      <RoundTitle title={INTRO_TEXT}/>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <MemoGrid cards={cards} config={config} phase="preview" onCardClick={() => {}}/>
      </div>
      <BottomBar onBack={onBack}>
        <button className="btn btn-bar" onClick={startGame}>Начать →</button>
      </BottomBar>
    </div>
  );

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>
      <RoundTitle title={INTRO_TEXT} subtitle={`Попыток: ${attempts} · Пар: ${matchedCount} / ${totalPairs}`}/>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <MemoGrid cards={cards} config={config} phase="play" onCardClick={handleCard}/>
      </div>
      <BottomBar onBack={onBack}>
        <button className="btn btn-bar" onClick={restart}>🔄 Заново</button>
      </BottomBar>
    </div>
  );
}
