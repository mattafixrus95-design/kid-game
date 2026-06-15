import { useState } from "react";
import { randomItem, randomItemExceptKey, shuffle } from "../lib/random";
import { speak, playSuccess, playError } from "../lib/audio";
import { useIntroSpeech } from "../hooks/useSpeech";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

const OPT_COUNT = 4;

function generateQuestion(items, getKey, excludeKey = null, optCount = OPT_COUNT) {
  const correct = excludeKey != null ? randomItemExceptKey(items, getKey, excludeKey) : randomItem(items);
  const cnt = Math.min(optCount, items.length);
  const pool = shuffle(items.filter(x => getKey(x) !== getKey(correct)));
  return { correct, options: shuffle([correct, ...pool.slice(0, cnt-1)]) };
}

// Универсальный экран уровня "Узнавание" — отличия игр задаются конфигом из registry
export default function GameQuizScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const { getKey, getName, introTextQuiz, titleQuiz, renderOption, getOptionStyle, optionsContainerStyle, onSelect, optCount } = config;

  const [question, setQuestion] = useState(()=>generateQuestion(items, getKey, null, optCount));
  const [answerState, setAnswerState] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  useIntroSpeech(getName(question.correct), introTextQuiz);

  function handleAnswer(item) {
    if (answerState !== null) return;
    const key = getKey(item);
    setChosen(key);
    if (onSelect) onSelect(item);
    if (key === getKey(question.correct)) {
      playSuccess(); setAnswerState("correct");
      const ns = score+1, nst = streak+1; setScore(ns); setStreak(nst);
      if (ns > record) onUpdateRecord(ns);
      setTimeout(()=>{ setAnswerState(null); setChosen(null); setQuestion(generateQuestion(items, getKey, getKey(question.correct), optCount)); },700);
    } else {
      playError(); setAnswerState("wrong"); setStreak(0);
      setTimeout(()=>{ setAnswerState(null); setChosen(null); },700);
    }
  }
  function handleRepeat() { speak(getName(question.correct)); }

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title={titleQuiz} subtitle={getName(question.correct)}/>
      <div style={{flex:1,display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"center",width:"100%",...optionsContainerStyle}}>
        {question.options.map(item=>(
          <button key={getKey(item)} className="pressable" onClick={()=>handleAnswer(item)}
            style={getOptionStyle(item, { chosen, answerState })}>
            {renderOption(item)}
          </button>
        ))}
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
      </BottomBar>
    </div>
  );
}
