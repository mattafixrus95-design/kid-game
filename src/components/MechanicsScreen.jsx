import { SKILLS, MECHANICS } from "../lib/skills";
import { clamp } from "../lib/styles";
import VersionButton from "./VersionButton";

export default function MechanicsScreen({ skill, onSelect, onBack }) {
  const skillDef = SKILLS.find(s => s.id === skill);
  const mechanics = MECHANICS[skill] || [];

  return (
    <div className="screen" style={{ gap: clamp(14, 22) }}>
      <VersionButton/>
      <div style={{ width: "100%", maxWidth: 500 }}>
        <button className="btn btn-back" onClick={onBack}>← Назад</button>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "clamp(2rem,7vw,3rem)" }}>{skillDef?.emoji}</div>
        <h2 style={{ fontSize: "clamp(1.5rem,6vw,2rem)", fontWeight: 900, color: "var(--text)" }}>{skillDef?.label}</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(10px,2vw,14px)", width: "100%", maxWidth: 440 }}>
        {mechanics.map(m => {
          const color = skillDef?.color || "var(--primary)";
          if (m.locked) {
            return (
              <div key={m.id} style={{ position: "relative", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 18,
                  padding: "clamp(14px,2.5vw,20px) clamp(20px,5vw,32px)",
                  background: "#F5F5F5", border: "3px solid #E0E0E0",
                  borderRadius: "var(--radius)", width: "100%",
                  filter: "blur(1.5px)", userSelect: "none",
                }}>
                  <span style={{ fontSize: "clamp(1.8rem,5vw,2.2rem)" }}>{m.emoji}</span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "clamp(1.1rem,4vw,1.5rem)", fontWeight: 800, color: "#aaa" }}>{m.label}</span>
                    <span style={{ fontSize: "clamp(0.8rem,2.5vw,1rem)", color: "#bbb" }}>{m.desc}</span>
                  </div>
                </div>
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end",
                  paddingRight: "clamp(20px,5vw,32px)",
                }}>
                  <span style={{
                    background: "rgba(0,0,0,0.55)", color: "#fff",
                    borderRadius: 20, padding: "4px 14px",
                    fontSize: "0.85rem", fontWeight: 700,
                  }}>🔒 Скоро</span>
                </div>
              </div>
            );
          }
          return (
            <button key={m.id} className="pressable" onClick={() => onSelect(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 18,
                padding: "clamp(14px,2.5vw,20px) clamp(20px,5vw,32px)",
                background: "#fff", color: "var(--text)",
                border: `3px solid ${color}`,
                borderRadius: "var(--radius)", boxShadow: `0 6px 0 ${color}55`,
                cursor: "pointer", width: "100%",
              }}>
              <span style={{ fontSize: "clamp(1.8rem,5vw,2.2rem)" }}>{m.emoji}</span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                <span style={{ fontSize: "clamp(1.1rem,4vw,1.5rem)", fontWeight: 800 }}>{m.label}</span>
                <span style={{ fontSize: "clamp(0.8rem,2.5vw,1rem)", color: "var(--muted)", fontWeight: 500 }}>{m.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
