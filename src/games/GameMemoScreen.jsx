import { useState, useCallback } from "react";
import { playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const PAIR_COUNT = 8;
const FLIP_BACK_DELAY = 900;
const CARD_BACK = "#6C63FF";

function buildCards(items) {
  const pool = shuffle([...items]).slice(0, Math.min(PAIR_COUNT, items.length));
  const pairs = shuffle([
    ...pool.map((item, i) => ({ uid: `a${i}`, item })),
    ...pool.map((item, i) => ({ uid: `b${i}`, item })),
  ]);
  return pairs.map(c => ({ ...c, matched: false }));
}

function MemoCard({ card, config, forceOpen, onClick }) {
  const { matched } = card;
  const isOpen = forceOpen || matched;

  return (
    <div
      onClick={onClick}
      style={{
        aspectRatio: "1/1",
        perspective: 600,
        cursor: (forceOpen || matched) ? "default" : "pointer",
      }}
    >
      <div style={{
        width: "100%", height: "100%",
        position: "relative",
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
          fontSize: "clamp(0.9rem,4vw,1.4rem)",
        }}>🃏</div>

        {/* Лицо */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: matched ? "var(--green)" : "var(--accent)",
          borderRadius: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 1, overflow: "hidden", padding: "4px 2px",
          boxShadow: "0 3px 0 rgba(0,0,0,0.12)",
        }}>
          <div style={{ fontSize: "clamp(1.6rem,10vw,3rem)", lineHeight: 1 }}>
            {card.item.emoji ?? config.renderLearn(card.item)}
          </div>
          <div style={{ fontSize: "clamp(0.55rem,2vw,0.85rem)", fontWeight: 700, color: "#fff", textAlign: "center", lineHeight: 1.1 }}>
            {config.getName(card.item)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Сетка 4×4, заполняет доступное пространство экрана
function MemoGrid({ cards, config, phase, onCardClick }) {
  return (
    <div style={{
      // Квадратная сетка, ограничена меньшим из ширины и доступной высоты
      width: "min(calc(100vw - 24px), calc(100dvh - 190px))",
      aspectRatio: "1/1",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gridTemplateRows: "repeat(4, 1fr)",
      gap: "clamp(4px,1.2vw,8px)",
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

export default function GameMemoScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const [phase, setPhase]   = useState("preview");
  const [cards, setCards]   = useState(() => buildCards(items));
  const [open, setOpen]     = useState([]);
  const [locked, setLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore]   = useState(0);
  const [streak, setStreak] = useState(0);

  const totalPairs   = cards.length / 2;
  const matchedCount = cards.filter(c => c.matched).length / 2;

  const startGame = useCallback(() => setPhase("play"), []);

  const restart = useCallback(() => {
    setCards(buildCards(items));
    setOpen([]);
    setLocked(false);
    setAttempts(0);
    setPhase("preview");
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

  // ── Экран завершения ──────────────────────────────────
  if (phase === "done") return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ fontSize: "clamp(3rem,16vw,6rem)" }}>🎉</div>
        <div style={{ fontSize: "clamp(1.4rem,5vw,2rem)", fontWeight: 900, color: "var(--text)", textAlign: "center" }}>
          Отлично!
        </div>
        <div style={{ fontSize: "clamp(1rem,3.5vw,1.4rem)", color: "var(--muted)", fontWeight: 700 }}>
          Попыток: {attempts}
        </div>
      </div>
      <BottomBar>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={restart}>Далее ➡️</button>
      </BottomBar>
    </div>
  );

  // ── Экран запоминания ─────────────────────────────────
  if (phase === "preview") return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title="Запомни карточки" subtitle="Посмотри внимательно"/>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <MemoGrid cards={cards} config={config} phase="preview" onCardClick={() => {}}/>
      </div>
      <BottomBar>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={startGame}>Начать ➡️</button>
      </BottomBar>
    </div>
  );

  // ── Экран игры ────────────────────────────────────────
  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle
        title="Найди пары"
        subtitle={`Попыток: ${attempts} · Пар: ${matchedCount} / ${totalPairs}`}
      />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <MemoGrid cards={cards} config={config} phase="play" onCardClick={handleCard}/>
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={restart}>🔄 Заново</button>
      </BottomBar>
    </div>
  );
}
