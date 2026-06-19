import { useState } from "react";
import { speak } from "../lib/audio";
import { useIntroSpeech } from "../hooks/useSpeech";
import { useBag } from "../lib/useBag";
import GameHeader from "../components/GameHeader";
import RoundTitle from "../components/RoundTitle";
import BottomBar from "../components/BottomBar";

export default function GameLearnScreen({ config, items, label, record, onUpdateRecord, onBack }) {
  const { getKey, getName, introTextLearn, titleLearn, renderLearn, onItemClick } = config;
  const nextItem = useBag(items);
  const [current, setCurrent] = useState(() => nextItem());
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [nextDisabled, setNextDisabled] = useState(false);

  useIntroSpeech(getName(current), introTextLearn);

  function handleRepeat() { speak(getName(current)); }

  function handleNext() {
    if (nextDisabled) return;
    setNextDisabled(true);
    setTimeout(() => setNextDisabled(false), 500);
    const ns = score + 1, nst = streak + 1;
    setScore(ns); setStreak(nst);
    if (ns > record) onUpdateRecord(ns);
    setCurrent(nextItem(getKey(current), getKey));
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
        <button className="btn btn-primary" style={{flex:1}} onClick={handleNext} disabled={nextDisabled}>Далее ➡️</button>
      </BottomBar>
    </div>
  );
}
