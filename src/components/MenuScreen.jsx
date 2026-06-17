import { clamp } from "../lib/styles";
import VersionButton from "./VersionButton";

const RUBRICS = [
  { id:"animals",  emoji:"🐶", label:"Животные",  color:"#4ECDC4" },
  { id:"vehicles", emoji:"🚗", label:"Машинки",   color:"#FF8F00" },
  { id:"numbers",  emoji:"🔢", label:"Цифры",     color:"#FF6B35" },
  { id:"colors",   emoji:"🎨", label:"Цвета",     color:"#8E24AA" },
  { id:"shapes",   emoji:"🔷", label:"Фигуры",    color:"#00ACC1" },
  { id:"fruits",     emoji:"🍎", label:"Фрукты",  color:"#66BB6A" },
  { id:"vegetables", emoji:"🥕", label:"Овощи",   color:"#FF8F00" },
];

export default function MenuScreen({ onSelect }) {
  return (
    <div className="screen" style={{justifyContent:"center",gap:clamp(16,24)}}>
      <VersionButton/>
      <div style={{textAlign:"center",marginBottom:4}}>
        <div style={{fontSize:"clamp(2rem,8vw,3rem)"}}>🌟</div>
        <h1 style={{fontSize:"clamp(1.8rem,7vw,2.6rem)",fontWeight:900,color:"var(--primary)",letterSpacing:"-1px"}}>
          Развивашки
        </h1>
        <p style={{color:"var(--muted)",fontSize:"clamp(0.9rem,3vw,1.1rem)",marginTop:4}}>Выбери игру</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(12px,2.5vw,18px)",width:"100%",maxWidth:440}}>
        {RUBRICS.map(r=>(
          <button key={r.id} className="pressable" onClick={()=>onSelect(r.id)} style={{
            display:"flex",alignItems:"center",gap:18,
            padding:"clamp(16px,3vw,24px) clamp(20px,5vw,32px)",
            background:"#fff",color:"var(--text)",border:`3px solid ${r.color}`,
            borderRadius:"var(--radius)",boxShadow:`0 6px 0 ${r.color}55`,
            cursor:"pointer",width:"100%",
          }}>
            <span style={{fontSize:"clamp(2rem,6vw,2.6rem)"}}>{r.emoji}</span>
            <span style={{fontSize:"clamp(1.3rem,5vw,1.8rem)",fontWeight:800}}>{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
