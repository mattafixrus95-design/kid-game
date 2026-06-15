import { settingsOptStyle, checkboxDotStyle } from "../lib/styles";
import VersionButton from "./VersionButton";

// Общий шаблон экрана настроек
export default function SettingsScreen({ emoji, title, sections, onStart, onBack, restoreState }) {
  const blocked = sections.some(sec => sec.multi && sec.values.length === 0);
  return (
    <div className="screen" style={{gap:"clamp(14px,3vw,24px)"}}>
      <VersionButton restoreState={restoreState}/>
      <div style={{width:"100%",maxWidth:500}}>
        <button className="btn btn-back" onClick={onBack}>← Назад</button>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"clamp(2rem,7vw,3rem)"}}>{emoji}</div>
        <h2 style={{fontSize:"clamp(1.5rem,6vw,2rem)",fontWeight:900,color:"var(--text)"}}>{title}</h2>
      </div>
      {sections.map((sec,i)=>(
        <div key={i} style={{width:"100%",maxWidth:500}}>
          <p style={{fontWeight:700,fontSize:"clamp(0.95rem,3vw,1.2rem)",marginBottom:10,color:"var(--muted)"}}>
            {sec.label}
          </p>
          <div style={{display:"flex",flexDirection:sec.column?"column":"row",flexWrap:"wrap",gap:10}}>
            {sec.options.map(opt=>{
              const active = sec.multi ? sec.values.includes(opt.id) : sec.value===opt.id;
              const color = sec.multi ? "var(--primary)" : (sec.color||"var(--primary)");
              return (
                <button key={opt.id} onClick={()=>sec.multi ? sec.onToggle(opt.id) : sec.onChange(opt.id)}
                  style={{
                    ...settingsOptStyle(active, color),
                    position:"relative",
                    ...(sec.multi
                      ? {display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2,textAlign:"left",paddingRight:40}
                      : (sec.column?{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2}:{}))
                  }}>
                  {sec.multi && <span style={checkboxDotStyle(active, color)}>{active?"✓":""}</span>}
                  <span>{opt.label}</span>
                  {opt.desc && <span style={{fontWeight:400,fontSize:"0.9rem",opacity:0.85}}>{opt.desc}</span>}
                </button>
              );
            })}
          </div>
          {sec.multi && sec.values.length===0 && (
            <p style={{color:"var(--red)",fontWeight:700,fontSize:"0.9rem",marginTop:8}}>
              Выберите хотя бы один набор
            </p>
          )}
        </div>
      ))}
      <button className="btn btn-primary"
        style={{width:"100%",maxWidth:500,fontSize:"clamp(1.2rem,4vw,1.6rem)",padding:"clamp(16px,3vw,22px)",
          opacity: blocked?0.5:1, cursor: blocked?"not-allowed":"pointer"}}
        disabled={blocked}
        onClick={blocked?undefined:onStart}>
        Начать 🚀
      </button>
    </div>
  );
}
