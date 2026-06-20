import { SKILLS } from "../lib/skills";
import { clamp } from "../lib/styles";
import { APP_VERSION } from "../version";
import VersionButton from "./VersionButton";

export default function SkillsScreen({ onSelect, onFeedback }) {
  return (
    <div className="screen" style={{ justifyContent: "center", gap: clamp(16, 24) }}>
      <VersionButton/>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: "clamp(2rem,8vw,3rem)" }}>🌟</div>
        <h1 style={{ fontSize: "clamp(1.8rem,7vw,2.6rem)", fontWeight: 900, color: "var(--primary)", letterSpacing: "-1px" }}>
          Развивашки
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "clamp(0.9rem,3vw,1.1rem)", marginTop: 4 }}>Выбери навык</p>
      </div>
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
      <button
        onClick={onFeedback}
        style={{
          position: "fixed", bottom: 32, right: 14,
          background: "none", border: "none", cursor: "pointer",
          fontSize: "0.8rem", color: "var(--text)", fontWeight: 700,
          padding: "4px 0", textDecoration: "underline", textDecorationStyle: "dotted",
        }}
      >
        ✉️ Обратная связь
      </button>
      <div style={{
        position: "fixed", bottom: 10, right: 14,
        fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, pointerEvents: "none",
      }}>
        v{APP_VERSION}
      </div>
    </div>
  );
}
