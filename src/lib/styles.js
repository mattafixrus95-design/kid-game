export const GLOBAL_STYLES = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#FFF9F0;--primary:#FF6B35;--primary-d:#E55A26;
    --accent:#4ECDC4;--accent-d:#3DB8B0;--text:#2D2D2D;--muted:#888;
    --green:#5CB85C;--red:#D9534F;--radius:24px;--shadow:0 4px 16px rgba(0,0,0,0.10);
  }
  html,body,#root{height:100%;width:100%;background:var(--bg);
    font-family:'Nunito','Segoe UI',Arial,sans-serif;color:var(--text);
    -webkit-tap-highlight-color:transparent;user-select:none;}
  body{overflow:hidden;touch-action:manipulation;}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;
    padding:16px 28px;border:none;border-radius:var(--radius);
    font-size:clamp(1rem,3vw,1.3rem);font-weight:700;cursor:pointer;
    transition:transform 0.15s;line-height:1.2;text-align:center;}
  .btn:active{transform:scale(0.93);}
  .btn-primary{background:var(--primary);color:#fff;box-shadow:0 4px 0 var(--primary-d);}
  .btn-ghost{background:#fff;color:var(--text);border:2px solid #E0E0E0;box-shadow:var(--shadow);}
  .btn-ghost:active{background:#F5F5F5;}
  .btn-back{background:#fff;color:var(--muted);border:2px solid #E0E0E0;
    padding:10px 20px;font-size:clamp(0.9rem,2.5vw,1.1rem);box-shadow:none;}
  .screen{display:flex;flex-direction:column;align-items:center;
    height:100dvh;width:100%;padding:clamp(12px,3vw,24px) clamp(12px,4vw,20px);
    overflow-y:auto;gap:clamp(8px,2vw,16px);}
  .pressable{transition:transform 0.15s;}
  .pressable:active{transform:scale(0.93);}
`;

export function clamp(a, b) {
  return `clamp(${a}px,3vw,${b}px)`;
}

// Стиль опции выбора в настройках
export function settingsOptStyle(active, color = "var(--primary)") {
  return {
    padding: "14px 18px", borderRadius: 16,
    border: `3px solid ${active ? color : "#E0E0E0"}`,
    background: active ? color : "#fff",
    color: active ? "#fff" : "var(--text)",
    fontWeight: 700, fontSize: "clamp(0.95rem,3vw,1.15rem)", cursor: "pointer",
    flex: 1, textAlign: "center", transition: "all 0.15s",
  };
}

// Кружок-чекбокс справа по центру карточки настроек (множественный выбор наборов)
export function checkboxDotStyle(active, color = "var(--primary)") {
  return {
    position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)",
    width: 24, height: 24, borderRadius: "50%",
    border: `2px solid ${active ? "#fff" : "#D8D8D8"}`,
    background: "#fff", color,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.85rem", fontWeight: 900, lineHeight: 1, flexShrink: 0,
    transition: "all 0.15s",
  };
}

// Единый крупный размер объекта на уровне "Повторение"
export function learnSvgSize(max = 280) {
  return Math.min(window.innerWidth * 0.75, max);
}
export const LEARN_EMOJI_SIZE = "clamp(7rem,38vw,14rem)";
export const LEARN_CIRCLE_SIZE = "clamp(180px,75vw,280px)";

// Рамка карточки-варианта в квизе: подсвечивает правильный/неправильный ответ
export function answerBorder(chosen, key, answerState) {
  if (chosen !== key) return "3px solid transparent";
  return answerState === "correct" ? "3px solid var(--green)" : "3px solid var(--red)";
}

export function optionTransform(chosen, key) {
  return chosen === key ? "scale(0.93)" : "scale(1)";
}

// Общий стиль карточки-варианта в квизе (фон + картинка/эмодзи + подпись)
export function cardOptionStyle(key, { chosen, answerState }, { background, boxShadow="0 6px 0 rgba(0,0,0,0.12)", padding=0 } = {}) {
  return {
    flex:"1 1 calc(50% - 8px)", minWidth:120, maxWidth:260, aspectRatio:"1/1", background,
    border: answerBorder(chosen, key, answerState),
    borderRadius:20, display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", gap:6,
    cursor:"pointer", boxShadow, padding,
    transform: optionTransform(chosen, key),
    transition:"transform 0.15s, border 0.15s",
  };
}
