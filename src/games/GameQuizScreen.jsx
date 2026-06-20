import { useState, useEffect } from "react";
import { shuffle } from "../lib/random";
import { speak, playSuccess, playError } from "../lib/audio";
import { useIntroSpeech } from "../hooks/useSpeech";
import { useBag } from "../lib/useBag";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const OPT_COUNT = 4;

export default function GameQuizScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const { getKey, getName, introTextQuiz, titleQuiz, renderOption, getOptionStyle, optionsContainerStyle, onSelect, optCount } = config;
  const nextCorrect = useBag(items);
  const [nextDisabled, setNextDisabled] = useState(false);

  // Принудительно декодируем все картинки при старте игры
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

  useIntroSpeech(getName(question.correct), introTextQuiz);

  function advance(excludeKey) {
    setAnswerState(null); setChosen(null);
    setQuestion(makeQuestion(excludeKey));
  }

  function handleNext() {
    if (nextDisabled) return;
    setNextDisabled(true);
    setTimeout(() => setNextDisabled(false), 500);
    advance(getKey(question.correct));
  }

  function handleAnswer(item) {
    if (answerState !== null) return;
    const key = getKey(item);
    setChosen(key);
    if (onSelect) onSelect(item);
    if (key === getKey(question.correct)) {
      playSuccess(); setAnswerState("correct");
      const ns = score + 1, nst = streak + 1; setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(() => advance(getKey(question.correct)), 700);
    } else {
      playError(); setAnswerState("wrong"); setStreak(0);
      setTimeout(() => { setAnswerState(null); setChosen(null); }, 700);
    }
  }
  function handleRepeat() { speak(getName(question.correct)); }

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title={titleQuiz} subtitle={getName(question.correct)}/>
      <div key={getKey(question.correct)} style={{flex:1,display:"flex",flexWrap:"wrap",alignItems:"center",alignContent:"center",justifyContent:"center",width:"100%",...optionsContainerStyle}}>
        {question.options.map(item=>(
          <button key={getKey(item)} className="pressable" onClick={()=>handleAnswer(item)}
            style={getOptionStyle(item, { chosen, answerState })}>
            {renderOption(item)}
          </button>
        ))}
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{flex:1}} onClick={handleNext} disabled={nextDisabled}>Далее ➡️</button>
      </BottomBar>
    </div>
  );
}
