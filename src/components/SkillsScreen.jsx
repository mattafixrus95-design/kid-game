import { SKILLS } from "../lib/skills";
import { clamp } from "../lib/styles";
import ServiceBar from "./ServiceBar";
import MenuHeader from "./MenuHeader";

export default function SkillsScreen({ onSelect, onFeedback }) {
  return (
    <div className="screen" style={{ gap: clamp(16, 24), paddingBottom: 64 }}>
      <ServiceBar onFeedback={onFeedback}/>
      <MenuHeader emoji="🌟" title="Развивашки" titleColor="var(--primary)"/>
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2.5vw,18px)", width: "100%", maxWidth: 440 }}>
        {SKILLS.map(s => (
          <button key={s.id} className="pressable" onClick={() => onSelect(s.id)}
            style={{
              display: "flex", alignItems: "center", gap: 18,
              padding: "clamp(16px,3vw,24px) clamp(20px,5vw,32px)",
              background: "#fff", color: "var(--text)",
              border: `3px solid ${s.color}`,
              borderRadius: "var(--radius)", boxShadow: `0 6px 0 ${s.color}55`,
              cursor: "pointer", width: "100%", textAlign: "left",
            }}>
            <span style={{ fontSize: "clamp(2rem,6vw,2.6rem)" }}>{s.emoji}</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
              <span style={{ fontSize: "clamp(1.3rem,5vw,1.8rem)", fontWeight: 800 }}>{s.label}</span>
              <span style={{ fontSize: "clamp(0.8rem,2.5vw,1rem)", color: "var(--muted)", fontWeight: 500 }}>{s.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
