import { useState, useEffect, useRef } from "react";
import { shuffle } from "../lib/random";
import { speak, stopCurrentAudio, playSuccess, playError } from "../lib/audio";
import { useStopAudioOnUnmount } from "../hooks/useSpeech";
import { useBag } from "../lib/useBag";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const OPT_COUNT = 4;

export default function GameQuizScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  useStopAudioOnUnmount();
  const { getKey, getName, introTextQuiz, titleQuiz, renderOption, getOptionStyle, optionsContainerStyle, optCount } = config;
  const nextCorrect = useBag(items);
  const [ready, setReady] = useState(false);
  const prevKeyRef = useRef(null);

  useEffect(() => {
    items.forEach(item => {
      if (item.image) {
        const img = new Image();
        img.src = item.image;
        img.decode().catch(() => {});
      }
    });
  }, [items]);

  function makeQuestion(excludeKey = null) {
    const correct = nextCorrect(excludeKey, getKey);
    const cnt = Math.min(optCount ?? OPT_COUNT, items.length);
    const pool = shuffle(items.filter(x => getKey(x) !== getKey(correct)));
    return { correct, options: shuffle([correct, ...pool.slice(0, cnt - 1)]) };
  }

  const [question, setQuestion] = useState(() => makeQuestion());
  const [answerState, setAnswerState] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Интро: сначала заголовок, потом показываем контент и называем объект
  useEffect(() => {
    speak(introTextQuiz, () => {
      setReady(true);
      setTimeout(() => speak(getName(question.correct)), 300);
    });
  }, []);

  // При смене вопроса (после первого) — озвучиваем новый объект
  useEffect(() => {
    const key = getKey(question.correct);
    if (!ready || prevKeyRef.current === null) { prevKeyRef.current = key; return; }
    if (prevKeyRef.current === key) return;
    prevKeyRef.current = key;
    setTimeout(() => speak(getName(question.correct)), 200);
  }, [question.correct, ready]);

  function advance(excludeKey) {
    setAnswerState(null); setChosen(null);
    setQuestion(makeQuestion(excludeKey));
  }

  function handleSkip() {
    stopCurrentAudio();
    window.speechSynthesis?.cancel();
    advance(getKey(question.correct));
  }

  function handleAnswer(item) {
    if (!ready || answerState !== null) return;
    const key = getKey(item);
    setChosen(key);
    if (key === getKey(question.correct)) {
      playSuccess(); setAnswerState("correct");
      const ns = score + 1, nst = streak + 1; setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(() => advance(getKey(question.correct)), 600);
    } else {
      playError(); setAnswerState("wrong"); setStreak(0);
      setTimeout(() => { setAnswerState(null); setChosen(null); }, 700);
    }
  }
  function handleRepeat() { speak(getName(question.correct)); }

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader label={label} record={record} streak={streak}/>
      <RoundTitle title={titleQuiz} subtitle={ready ? getName(question.correct) : ""}/>
      <div key={getKey(question.correct)} style={{flex:1,display:"flex",flexWrap:"wrap",alignItems:"center",alignContent:"center",justifyContent:"center",width:"100%",...optionsContainerStyle,opacity:ready?1:0,transition:"opacity 0.3s"}}>
        {question.options.map(item=>(
          <button key={getKey(item)} className="pressable" onClick={()=>handleAnswer(item)}
            style={getOptionStyle(item, { chosen, answerState })}>
            {renderOption(item)}
          </button>
        ))}
      </div>
      <BottomBar onBack={onBack}>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{flex:1}} onClick={handleSkip}>Пропустить ⏭️</button>
      </BottomBar>
    </div>
  );
}
