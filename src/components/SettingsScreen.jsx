import { settingsOptStyle } from "../lib/styles";
import VersionButton from "./VersionButton";

// Общий шаблон экрана настроек
export default function SettingsScreen({ emoji, title, sections, onStart, onBack }) {
  return (
    <div className="screen" style={{gap:"clamp(14px,3vw,24px)"}}>
      <VersionButton/>
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
          <div style={{display:"flex",flexDirection:sec.column?"column":"row",gap:10}}>
            {sec.options.map(opt=>(
              <button key={opt.id} onClick={()=>sec.onChange(opt.id)}
                style={{
                  ...settingsOptStyle(sec.value===opt.id, sec.color||"var(--primary)"),
                  ...(sec.column?{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2}:{})
                }}>
                <span>{opt.label}</span>
                {opt.desc && <span style={{fontWeight:400,fontSize:"0.9rem",opacity:0.85}}>{opt.desc}</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-primary"
        style={{width:"100%",maxWidth:500,fontSize:"clamp(1.2rem,4vw,1.6rem)",padding:"clamp(16px,3vw,22px)"}}
        onClick={onStart}>
        Начать 🚀
      </button>
    </div>
  );
}
