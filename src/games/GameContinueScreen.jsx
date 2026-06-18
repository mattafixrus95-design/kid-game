import { useState, useEffect, useRef } from "react";
import { speak, speakSequence, playSuccess, playError } from "../lib/audio";
import { shuffle } from "../lib/random";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

// Generates either an "alternating" (ABAB→?) or "sequential" (ABCD→?) round
function generateRound(items, getKey, prevCorrectKey) {
  const useAlternating = items.length >= 2 && Math.random() < 0.5;

  let sequence, correct;

  if (useAlternating) {
    // AB A → next is B
    const pool = shuffle([...items]);
    const a = pool[0], b = pool[1];
    sequence = [a, b, a];
    correct = b;
  } else {
    // A B C → next is D (sequential from shuffled pool, avoiding repeat)
    const pool = shuffle([...items]);
    const take = Math.min(4, pool.length);
    if (take < 2) {
      // fallback: alternating
      const a = pool[0], b = pool[0];
      sequence = [a, a, a];
      correct = a;
    } else {
      sequence = pool.slice(0, take - 1);
      correct = pool[take - 1];
    }
  }

  const correctKey = getKey(correct);
  const distractors = shuffle(
    items.filter(i => getKey(i) !== correctKey && getKey(i) !== prevCorrectKey)
  ).slice(0, 3);

  // Fill up to 3 distractors if needed
  if (distractors.length < 3) {
    const extras = items.filter(i => getKey(i) !== correctKey);
    while (distractors.length < 3 && extras.length > distractors.length) {
      const next = extras[distractors.length];
      if (!distractors.find(d => getKey(d) === getKey(next))) distractors.push(next);
    }
  }

  return { sequence, correct, options: shuffle([correct, ...distractors.slice(0, 3)]) };
}

export default function GameContinueScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const task = "Что дальше?";
  const [round, setRound]         = useState(() => generateRound(items, config.getKey, null));
  const [chosen, setChosen]       = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);

  const introRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!introRef.current) { introRef.current = true; speakSequence(task, ""); }
      else speak(task);
    }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function advanceRound() {
    setRound(generateRound(items, config.getKey, config.getKey(round.correct)));
    setChosen(null);
    setAnswerState(null);
  }

  function handleAnswer(item) {
    if (answerState !== null) return;
    const isCorrect = config.getKey(item) === config.getKey(round.correct);
    setChosen(config.getKey(item));
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

  // Render a single item in the sequence row
  function renderItem(item, key) {
    return (
      <div key={key} style={{
        background: "var(--primary)", borderRadius: 14,
        width: "clamp(52px,14vw,76px)", aspectRatio: "1/1",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 2,
        boxShadow: "0 4px 0 rgba(0,0,0,0.10)", flexShrink: 0,
      }}>
        {item.emoji
          ? <span style={{ fontSize: "clamp(1.5rem,8vw,2.6rem)", lineHeight: 1 }}>{item.emoji}</span>
          : <span style={{ fontSize: "clamp(1.4rem,7vw,2.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{item}</span>
        }
      </div>
    );
  }

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title={task} subtitle="Найди следующий элемент"/>

      {/* Sequence row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "clamp(6px,2vw,12px)", width: "100%", maxWidth: 480,
        flexWrap: "nowrap", overflowX: "auto", padding: "0 4px",
      }}>
        {round.sequence.map((item, i) => renderItem(item, `seq-${i}`))}

        {/* Arrow */}
        <span style={{ fontSize: "clamp(1.2rem,5vw,1.8rem)", color: "var(--muted)", flexShrink: 0 }}>→</span>

        {/* Question mark placeholder */}
        <div style={{
          background: "#E0E0E0", borderRadius: 14,
          width: "clamp(52px,14vw,76px)", aspectRatio: "1/1",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 0 rgba(0,0,0,0.06)", flexShrink: 0,
        }}>
          <span style={{ fontSize: "clamp(1.4rem,7vw,2.4rem)", color: "#999", fontWeight: 900 }}>?</span>
        </div>
      </div>

      {/* Answer options */}
      <div style={{
        flex: 1, display: "flex", flexWrap: "wrap",
        alignItems: "center", alignContent: "center", justifyContent: "center",
        width: "100%", gap: "clamp(10px,3vw,18px)", maxWidth: 480,
      }}>
        {round.options.map(item => {
          const key = config.getKey(item);
          const isChosen = chosen === key;
          const bg = isChosen
            ? (answerState === "correct" ? "var(--green)" : "var(--red)")
            : "var(--accent)";
          return (
            <button key={key}
              onClick={() => handleAnswer(item)}
              style={{
                flex: "1 1 calc(50% - 8px)", minWidth: 110, maxWidth: 220, aspectRatio: "1/1",
                background: bg, border: "3px solid transparent",
                borderRadius: 18, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 4,
                cursor: "pointer", boxShadow: "0 5px 0 rgba(0,0,0,0.12)",
                transform: isChosen ? "scale(0.93)" : "scale(1)",
                transition: "transform 0.15s, background 0.2s",
                animation: isChosen && answerState === "wrong" ? "shake 0.5s" : "none",
              }}>
              {item.emoji
                ? <>
                    <span style={{ fontSize: "clamp(2.2rem,12vw,4rem)", lineHeight: 1 }}>{item.emoji}</span>
                    <span style={{ fontSize: "clamp(0.75rem,2.5vw,1.1rem)", fontWeight: 700, color: "#fff", textAlign: "center" }}>
                      {config.getName(item)}
                    </span>
                  </>
                : <span style={{ fontSize: "clamp(2.5rem,14vw,4.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                    {item}
                  </span>
              }
            </button>
          );
        })}
      </div>

      <BottomBar>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => speak(task)}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={advanceRound}>Следующий ➡️</button>
      </BottomBar>
    </div>
  );
}
