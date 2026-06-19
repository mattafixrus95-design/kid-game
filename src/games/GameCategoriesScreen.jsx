import { useState, useEffect } from "react";
import { speak, speakSequence, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import { useBag } from "../lib/useBag";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

// Дистракторы: элементы из ДРУГИХ категорий (только emoji-контент)
const DISTRACTORS = {
  animals: [
    { name: "Яблоко",  emoji: "🍎" }, { name: "Банан",   emoji: "🍌" },
    { name: "Морковь", emoji: "🥕" }, { name: "Помидор", emoji: "🍅" },
    { name: "Машина",  emoji: "🚗" }, { name: "Автобус", emoji: "🚌" },
    { name: "Трактор", emoji: "🚜" }, { name: "Мяч",     emoji: "⚽" },
    { name: "Дом",     emoji: "🏠" }, { name: "Книга",   emoji: "📚" },
  ],
  food: [
    { name: "Собака",  emoji: "🐶" }, { name: "Кошка",   emoji: "🐱" },
    { name: "Лошадь",  emoji: "🐴" }, { name: "Корова",  emoji: "🐮" },
    { name: "Машина",  emoji: "🚗" }, { name: "Автобус", emoji: "🚌" },
    { name: "Трактор", emoji: "🚜" }, { name: "Мяч",     emoji: "⚽" },
    { name: "Дом",     emoji: "🏠" }, { name: "Звезда",  emoji: "⭐" },
  ],
};

export default function GameCategoriesScreen({ config, contentId, categoryLabel, items, label, record, onUpdateRecord, onBack }) {
  const distractors = DISTRACTORS[contentId] || DISTRACTORS.food;
  const task = `Найди ${categoryLabel}`;
  const nextCorrect = useBag(items);
  const [nextDisabled, setNextDisabled] = useState(false);

  function makeRound() {
    const correct = nextCorrect();
    const dists = shuffle(distractors.filter(d => d.name !== correct.name)).slice(0, 3);
    return { correct, options: shuffle([correct, ...dists]) };
  }

  const [round, setRound] = useState(() => makeRound());
  const [chosen, setChosen] = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Озвучка только при входе на экран
  useEffect(() => {
    const t = setTimeout(() => { speakSequence(task, ""); }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRepeat() { speak(task); }

  function advanceRound() {
    setRound(makeRound());
    setChosen(null);
    setAnswerState(null);
  }

  function handleNext() {
    if (nextDisabled) return;
    setNextDisabled(true);
    setTimeout(() => setNextDisabled(false), 500);
    advanceRound();
  }

  function handleAnswer(item) {
    if (answerState !== null) return;
    const isCorrect = item.name === round.correct.name;
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
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title={task} subtitle={`Выбери ${categoryLabel}`}/>
      <div style={{
        flex: 1, display: "flex", flexWrap: "wrap",
        alignItems: "center", alignContent: "center", justifyContent: "center",
        width: "100%", gap: "clamp(10px,3vw,20px)", maxWidth: 560,
      }}>
        {round.options.map(item => {
          const isChosen = chosen === item.name;
          const bg = isChosen
            ? (answerState === "correct" ? "var(--green)" : "var(--red)")
            : "var(--accent)";
          return (
            <button key={item.name}
              onClick={() => handleAnswer(item)}
              style={{
                flex: "1 1 calc(50% - 8px)", minWidth: 120, maxWidth: 260, aspectRatio: "1/1",
                background: bg, border: "3px solid transparent",
                borderRadius: 20, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
                cursor: "pointer", boxShadow: "0 6px 0 rgba(0,0,0,0.12)",
                transform: isChosen ? "scale(0.93)" : "scale(1)",
                transition: "transform 0.15s, background 0.2s",
              }}>
              <span style={{ fontSize: "clamp(3rem,18vw,6rem)" }}>{item.emoji}</span>
              <span style={{ fontSize: "clamp(0.85rem,3vw,1.3rem)", fontWeight: 700, color: "#fff", textAlign: "center" }}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleRepeat}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleNext} disabled={nextDisabled}>Далее ➡️</button>
      </BottomBar>
    </div>
  );
}
