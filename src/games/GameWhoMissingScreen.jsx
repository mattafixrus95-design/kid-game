import { useState, useEffect } from "react";
import { speak, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import { useBag } from "../lib/useBag";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const SHOWN_COUNT = 4;

function generateRound(items, nextItem, getKey) {
  const shown = [];
  const usedKeys = new Set();
  while (shown.length < Math.min(SHOWN_COUNT, items.length)) {
    const item = nextItem();
    if (!usedKeys.has(getKey(item))) {
      usedKeys.add(getKey(item));
      shown.push(item);
    }
  }
  const missingIdx = Math.floor(Math.random() * shown.length);
  const missing = shown[missingIdx];
  // null = пустой слот на месте пропавшего
  const withSlot = shown.map((item, i) => i === missingIdx ? null : item);
  const distractors = shuffle(items.filter(i => !usedKeys.has(getKey(i)))).slice(0, 3);
  const options = shuffle([missing, ...distractors]);
  return { shown, withSlot, missing, options };
}

// Одна карточка — используется и для показа, и для вариантов ответа
function ItemCard({ item, getName, emojiSize, as: As = "div", onClick, chosen, answerState, getKey }) {
  const isChosen = chosen && item && getKey && getKey(item) === chosen;
  const bg = isChosen
    ? (answerState === "correct" ? "var(--green)" : "var(--red)")
    : "var(--accent)";

  return (
    <As
      onClick={onClick}
      style={{
        aspectRatio: "1/1",
        background: bg,
        borderRadius: 18,
        border: "3px solid transparent",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 0, padding: "6px 4px",
        boxShadow: onClick ? "0 6px 0 rgba(0,0,0,0.12)" : "0 4px 0 rgba(0,0,0,0.10)",
        cursor: onClick ? "pointer" : "default",
        transform: isChosen ? "scale(0.93)" : "scale(1)",
        transition: "transform 0.15s, background 0.2s",
        animation: isChosen && answerState === "wrong" ? "shake 0.5s" : "none",
        overflow: "hidden",
      }}
    >
      <span style={{ fontSize: emojiSize, lineHeight: 1, flexShrink: 0 }}>{item.emoji}</span>
      <span style={{
        fontSize: "clamp(0.6rem,2vw,0.85rem)", fontWeight: 700,
        color: "#fff", textAlign: "center", marginTop: 3,
        lineHeight: 1.1, wordBreak: "break-word",
      }}>
        {getName(item)}
      </span>
    </As>
  );
}

// Пустой слот — место пропавшей карточки
function EmptySlot() {
  return (
    <div style={{
      aspectRatio: "1/1", borderRadius: 18,
      border: "3px dashed #CCC", background: "rgba(0,0,0,0.03)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ fontSize: "clamp(1.4rem,8vw,2.2rem)", color: "#CCC" }}>?</span>
    </div>
  );
}

export default function GameWhoMissingScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const { getKey, getName } = config;
  const nextItem = useBag(items);
  const [phase, setPhase]         = useState("memorize");
  const [round, setRound]         = useState(() => generateRound(items, nextItem, getKey));
  const [chosen, setChosen]       = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    if (phase === "quiz") {
      const t = setTimeout(() => speak("Кто пропал?"), 300);
      return () => clearTimeout(t);
    }
  }, [phase]);

  function startQuiz() { setPhase("quiz"); }

  function advanceRound() {
    setRound(generateRound(items, nextItem, getKey));
    setChosen(null);
    setAnswerState(null);
    setPhase("memorize");
  }

  function handleAnswer(item) {
    if (answerState !== null) return;
    const key = getKey(item);
    setChosen(key);
    if (key === getKey(round.missing)) {
      playSuccess();
      setAnswerState("correct");
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(advanceRound, 900);
    } else {
      playError();
      setAnswerState("wrong");
      setStreak(0);
      setTimeout(() => { setChosen(null); setAnswerState(null); }, 700);
    }
  }

  // Единая сетка 4 колонки, растягивается на всю ширину
  const gridStyle = {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "clamp(8px,2.5vw,12px)", width: "100%", maxWidth: 480,
  };
  // Размер emoji подбирается под ширину карточки ≈ 22vw (с учётом 4 карточки + гэп)
  const emojiSize = "clamp(1.8rem,11vw,3.2rem)";

  // ── Экран 1: Запомни ──────────────────────────────────
  if (phase === "memorize") return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title="Запомни предметы" subtitle="Посмотри внимательно"/>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={gridStyle}>
          {round.shown.map(item => (
            <ItemCard key={getKey(item)} item={item} getName={getName} emojiSize={emojiSize}/>
          ))}
        </div>
      </div>
      <BottomBar>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={startQuiz}>Далее ➡️</button>
      </BottomBar>
    </div>
  );

  // ── Экран 2: Кто пропал? ─────────────────────────────
  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title="Кто пропал?"/>

      {/* Те же 4 слота — один заменён на ? */}
      <div style={gridStyle}>
        {round.withSlot.map((item, i) =>
          item
            ? <ItemCard key={getKey(item)} item={item} getName={getName} emojiSize={emojiSize}/>
            : <EmptySlot key={`empty-${i}`}/>
        )}
      </div>

      <div style={{ fontWeight: 700, fontSize: "clamp(1rem,3.5vw,1.3rem)", color: "var(--text)", textAlign: "center" }}>
        Кого не хватает?
      </div>

      {/* Варианты ответа — та же сетка, те же карточки, интерактивные */}
      <div style={gridStyle}>
        {round.options.map(item => (
          <ItemCard
            key={getKey(item)} item={item} getName={getName} emojiSize={emojiSize}
            as="button" onClick={() => handleAnswer(item)}
            chosen={chosen} answerState={answerState} getKey={getKey}
          />
        ))}
      </div>

      <BottomBar>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => speak("Кто пропал?")}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
          if (nextDisabled) return;
          setNextDisabled(true);
          setTimeout(() => setNextDisabled(false), 500);
          advanceRound();
        }} disabled={nextDisabled}>Далее ➡️</button>
      </BottomBar>
    </div>
  );
}
