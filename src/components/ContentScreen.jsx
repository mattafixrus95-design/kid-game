import { REGISTRY } from "../games/registry";
import { clamp } from "../lib/styles";
import ServiceBar from "./ServiceBar";

const CONTENT_COLORS = {
  animals:"#4ECDC4",
  vehicles:"#FF8F00",
  food:"#66BB6A",
  colors:"#8E24AA",
  shapes:"#00ACC1",
  numbers:"#FF6B35",
};

export default function ContentScreen({ mechanic, onSelect, onBack, onFeedback }) {
  const available = Object.entries(REGISTRY)
    .filter(([,cfg]) => cfg.supportsMechanics?.includes(mechanic));

  return (
    <div className="screen" style={{gap:clamp(16,24), paddingBottom: 64}}>
      <ServiceBar onBack={onBack} onFeedback={onFeedback}/>
      <div style={{textAlign:"center",marginBottom:4}}>
        <h2 style={{fontSize:"clamp(1.5rem,6vw,2rem)",fontWeight:900,color:"var(--text)"}}>Выбери тему</h2>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(12px,2.5vw,18px)",width:"100%",maxWidth:440}}>
        {available.map(([id,cfg])=>{
          const color = CONTENT_COLORS[id]||"var(--primary)";
          return (
            <button key={id} className="pressable" onClick={()=>onSelect(id)}
              style={{
                display:"flex",alignItems:"center",gap:18,
                padding:"clamp(16px,3vw,24px) clamp(20px,5vw,32px)",
                background:"#fff",color:"var(--text)",
                border:`3px solid ${color}`,
                borderRadius:"var(--radius)",boxShadow:`0 6px 0 ${color}55`,
                cursor:"pointer",width:"100%",
              }}>
              <span style={{fontSize:"clamp(2rem,6vw,2.6rem)"}}>{cfg.emoji}</span>
              <span style={{fontSize:"clamp(1.3rem,5vw,1.8rem)",fontWeight:800}}>{cfg.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
