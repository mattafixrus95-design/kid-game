// Единая шапка для навигационных экранов (Skills/Mechanics/Content/Subsets) —
// одинаковый размер эмодзи/заголовка и отступы, чтобы контент не "прыгал"
// при переходах между этими экранами.
export default function MenuHeader({ emoji, title, subtitle, titleColor = "var(--text)" }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 4 }}>
      <div style={{ fontSize: "clamp(2rem,7vw,3rem)", lineHeight: 1 }}>{emoji}</div>
      <h1 style={{
        fontSize: "clamp(1.5rem,6vw,2rem)", fontWeight: 900,
        color: titleColor, marginTop: 8, letterSpacing: "-0.5px",
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: "var(--muted)", fontSize: "clamp(0.85rem,2.8vw,1rem)", fontWeight: 600, marginTop: 4 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
