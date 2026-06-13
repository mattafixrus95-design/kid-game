import { useState } from "react";
import { randomItem, randomItemExceptKey } from "../lib/random";
import { speak } from "../lib/audio";
import { useIntroSpeech } from "../hooks/useSpeech";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

// Универсальный экран уровня "Повторение" — отличия игр задаются конфигом из registry
export default function GameLearnScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const { getKey, getName, introTextLearn, titleLearn, renderLearn, onItemClick } = config;
  const [current, setCurrent] = useState(()=>randomItem(items));
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);

  useIntroSpeech(getName(current), introTextLearn);

  function handleRepeat() { speak(getName(current)); }
  function handleNext() {
    const next = randomItemExceptKey(items, getKey, getKey(current));
    const ns = score+1, nst = streak+1;
    setScore(ns); setStreak(nst);
    if (ns > record) onUpdateRecord(ns);
    setCurrent(next);
  }

  return (
    <div className="screen" style={{justifyContent:"space-between"}}>
      <GameHeader onBack={onBack} label={label} record={record} streak={streak}/>
      <RoundTitle title={titleLearn} subtitle={getName(current)}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div className="pressable" style={{cursor:"pointer"}} onClick={()=>onItemClick ? onItemClick(current) : handleRepeat()}>
          {renderLearn(current)}
        </div>
      </div>
      <BottomBar>
        <button className="btn btn-ghost" style={{flex:1}} onClick={handleRepeat}>🔊 Повторить</button>
        <button className="btn btn-primary" style={{flex:1}} onClick={handleNext}>Следующий ➡️</button>
      </BottomBar>
    </div>
  );
}
