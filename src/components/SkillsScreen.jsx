import { clamp } from "../lib/styles";
import VersionButton from "./VersionButton";

export const SKILLS = [
  { id:"vocabulary",   emoji:"📖", label:"Словарный запас", color:"#4ECDC4", desc:"Учим новые слова" },
  { id:"quiz",         emoji:"🎯", label:"Угадывание",       color:"#FF6B35", desc:"Выбери правильный ответ" },
  { id:"combinations", emoji:"🔗", label:"Словосочетания",   color:"#8E24AA", desc:"Цвет и предмет" },
  { id:"count",        emoji:"🔢", label:"Счёт",             color:"#00ACC1", desc:"Учим цифры" },
  { id:"memory",       emoji:"🧠", label:"Память",           color:"#aaa",    desc:"Скоро", locked:true },
  { id:"logic",        emoji:"🧩", label:"Логика",           color:"#aaa",    desc:"Скоро", locked:true },
];

export default function SkillsScreen({ onSelect }) {
  return (
    <div className="screen" style={{justifyContent:"center",gap:clamp(16,24)}}>
      <VersionButton/>
      <div style={{textAlign:"center",marginBottom:4}}>
        <div style={{fontSize:"clamp(2rem,8vw,3rem)"}}>🌟</div>
        <h1 style={{fontSize:"clamp(1.8rem,7vw,2.6rem)",fontWeight:900,color:"var(--primary)",letterSpacing:"-1px"}}>
          Развивашки
        </h1>
        <p style={{color:"var(--muted)",fontSize:"clamp(0.9rem,3vw,1.1rem)",marginTop:4}}>Выбери навык</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(12px,2.5vw,18px)",width:"100%",maxWidth:440}}>
        {SKILLS.map(s=>(
          <button key={s.id} className={s.locked ? "" : "pressable"}
            onClick={()=>!s.locked && onSelect(s.id)}
            style={{
              display:"flex",alignItems:"center",gap:18,
              padding:"clamp(14px,2.5vw,20px) clamp(20px,5vw,32px)",
              background:s.locked?"#F5F5F5":"#fff",
              color:s.locked?"#aaa":"var(--text)",
              border:`3px solid ${s.color}`,
              borderRadius:"var(--radius)",
              boxShadow:s.locked?"none":`0 6px 0 ${s.color}55`,
              cursor:s.locked?"default":"pointer",width:"100%",
              opacity:s.locked?0.6:1,
            }}>
            <span style={{fontSize:"clamp(2rem,6vw,2.6rem)"}}>{s.emoji}</span>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2}}>
              <span style={{fontSize:"clamp(1.2rem,4.5vw,1.6rem)",fontWeight:800}}>{s.label}</span>
              <span style={{fontSize:"clamp(0.8rem,2.5vw,1rem)",color:s.locked?"#aaa":"var(--muted)",fontWeight:500}}>{s.desc}</span>
            </div>
            {s.locked && <span style={{marginLeft:"auto",fontSize:"1rem"}}>🔒</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
