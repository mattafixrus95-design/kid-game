import { useState, useEffect, useRef } from "react";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { speak, speakSequence, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import { ANIMAL_SETS } from "../data/animals";
import { VEHICLE_SETS } from "../data/vehicles";
import { FOOD_SETS } from "../data/food";
import { SHAPE_SETS } from "../data/shapes";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

// Пул "лишних" берём из других категорий (реальные объекты с картинками)
const ALL_ANIMALS = [...ANIMAL_SETS.domestic, ...ANIMAL_SETS.wild];
const ALL_VEHICLES = [...VEHICLE_SETS.everyday, ...VEHICLE_SETS.construction, ...VEHICLE_SETS.special];
const ALL_FOOD = [...FOOD_SETS.fruits_simple, ...FOOD_SETS.vegetables_simple];
const ALL_SHAPES = [...SHAPE_SETS.simple, ...SHAPE_SETS.composite];

const OUTLIER_POOL = {
  animals:  shuffle([...ALL_VEHICLES.slice(0, 6), ...ALL_SHAPES.slice(0, 4)]),
  vehicles: shuffle([...ALL_ANIMALS.slice(0, 6),  ...ALL_SHAPES.slice(0, 4)]),
  food:     shuffle([...ALL_ANIMALS.slice(0, 5),  ...ALL_VEHICLES.slice(0, 5)]),
  shapes:   shuffle([...ALL_ANIMALS.slice(0, 5),  ...ALL_FOOD.slice(0, 5)]),
};

function generateRound(items, outlierPool, prevOutlierName) {
  const pool = shuffle([...items]).slice(0, 3);
  const available = outlierPool.filter(o => o.name !== prevOutlierName);
  const outlier = available[Math.floor(Math.random() * available.length)];
  return { outlier, options: shuffle([...pool, outlier]) };
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
  return <span style={{ fontSize: "clamp(3rem,18vw,6rem)", lineHeight: 1 }}>{item.emoji}</span>;
}

export default function GameOddOneScreen({ config, contentId, items, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const outlierPool = OUTLIER_POOL[contentId] || OUTLIER_POOL.animals;
  const task = "Найди лишнее";

  const [round, setRound]         = useState(() => generateRound(items, outlierPool, null));
  const [chosen, setChosen]       = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [nextDisabled, setNextDisabled] = useState(false);

  const introRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!introRef.current) { introRef.current = true; speakSequence(task, ""); }
      else speak(task);
    }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.outlier.name]);

  function advanceRound() {
    setRound(generateRound(items, outlierPool, round.outlier.name));
    setChosen(null);
    setAnswerState(null);
  }

  function handleAnswer(item) {
    if (answerState !== null) return;
    const isCorrect = item.name === round.outlier.name;
    setChosen(item.name);
    if (isCorrect) {
      playSuccess();
      setAnswerState("correct");
      const ns = score + 1, nst = streak + 1;
      setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(advanceRound, 700);
    } else {
      playError();
      setAnswerState("wrong");
      setStreak(0);
      setTimeout(() => { setChosen(null); setAnswerState(null); }, 700);
    }
  }

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader label={label} record={record} streak={streak}/>
      <RoundTitle title={task} subtitle="Что здесь лишнее?"/>
      <div style={{
        flex: 1, display: "flex", flexWrap: "wrap",
        alignItems: "center", alignContent: "center", justifyContent: "center",
        width: "100%", gap: "clamp(10px,3vw,20px)", maxWidth: 560,
      }}>
        {round.options.map(item => {
          const isChosen = chosen === item.name;
          const isCorrect = item.name === round.outlier.name;
          const showCorrect = answerState === "correct" && isCorrect;
          const border = isChosen
            ? (answerState === "correct" ? "3px solid var(--green)" : "3px solid var(--red)")
            : (showCorrect ? "3px solid var(--green)" : "3px solid transparent");
          const bg = isChosen
            ? (answerState === "correct" ? "rgba(92,184,92,0.15)" : "rgba(217,83,79,0.12)")
            : "#fff";
          return (
            <button key={item.name}
              onClick={() => handleAnswer(item)}
              style={{
                flex: "1 1 calc(50% - 8px)", minWidth: 120, maxWidth: 260, aspectRatio: "1/1",
                background: bg, border,
                borderRadius: 20, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
                cursor: "pointer", boxShadow: "0 6px 0 rgba(0,0,0,0.12)",
                transform: isChosen ? "scale(0.93)" : "scale(1)",
                transition: "transform 0.15s, background 0.2s, border 0.15s",
                overflow: "hidden",
              }}>
              <ItemContent item={item}/>
              <span style={{ fontSize: "clamp(0.75rem,2.5vw,1rem)", fontWeight: 700, color: "var(--text)", textAlign: "center", paddingInline: 4 }}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
      <BottomBar onBack={onBack}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => speak(task)}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
          if (nextDisabled) return;
          setNextDisabled(true);
          setTimeout(() => setNextDisabled(false), 500);
          advanceRound();
        }} disabled={nextDisabled}>Пропустить ➡️</button>
      </BottomBar>
    </div>
  );
}
