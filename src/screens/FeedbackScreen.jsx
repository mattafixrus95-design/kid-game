import { useState } from "react";
import emailjs from "@emailjs/browser";
import { APP_VERSION } from "../version";
import BottomBar from "../components/BottomBar";

const SERVICE_ID  = "service_dzz65qf";
const TEMPLATE_ID = "template_5uljn07";
const PUBLIC_KEY  = "71CsVkBqA3M5FgtOX";

const SUBJECTS = [
  { id: "bug",  label: "🐛 Сообщить об ошибке" },
  { id: "idea", label: "💡 Предложить идею" },
];

export default function FeedbackScreen({ onBack }) {
  const [subject,  setSubject]  = useState("");
  const [message,  setMessage]  = useState("");
  const [email,    setEmail]    = useState("");
  const [status,   setStatus]   = useState(null); // null | "sending" | "success" | "error"
  const [error,    setError]    = useState("");

  async function handleSubmit() {
    if (!subject) { setError("Выбери тему сообщения"); return; }
    if (!message.trim()) { setError("Напиши сообщение"); return; }
    setError("");
    setStatus("sending");

    const subjectLabel = SUBJECTS.find(s => s.id === subject)?.label ?? subject;

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        subject:     subjectLabel,
        message:     message.trim(),
        user_email:  email.trim() || "не указан",
        app_version: APP_VERSION,
        user_agent:  navigator.userAgent,
        timestamp:   new Date().toLocaleString("ru-RU"),
      }, PUBLIC_KEY);

      setStatus("success");
      setSubject("");
      setMessage("");
      setEmail("");
      setTimeout(onBack, 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="screen" style={{ justifyContent: "space-between" }}>
      {/* Header */}
      <div style={{ width: "100%", textAlign: "center", paddingBottom: 4 }}>
        <span style={{ fontWeight: 900, fontSize: "clamp(1.2rem,5vw,1.6rem)", color: "var(--text)" }}>
          Обратная связь
        </span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, width: "100%", maxWidth: 480, overflowY: "auto" }}>

        {/* Тема */}
        <div>
          <div style={{ fontWeight: 800, fontSize: "clamp(0.9rem,3vw,1.05rem)", color: "var(--text)", marginBottom: 8 }}>
            Тема <span style={{ color: "var(--red)" }}>*</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SUBJECTS.map(s => (
              <button
                key={s.id}
                onClick={() => setSubject(s.id)}
                style={{
                  padding: "14px 18px",
                  borderRadius: "var(--radius)",
                  border: `3px solid ${subject === s.id ? "var(--primary)" : "#DDD"}`,
                  background: subject === s.id ? "var(--primary)" : "#fff",
                  color: subject === s.id ? "#fff" : "var(--text)",
                  fontWeight: 800, fontSize: "clamp(0.95rem,3.5vw,1.1rem)",
                  textAlign: "left", cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Сообщение */}
        <div>
          <div style={{ fontWeight: 800, fontSize: "clamp(0.9rem,3vw,1.05rem)", color: "var(--text)", marginBottom: 8 }}>
            Сообщение <span style={{ color: "var(--red)" }}>*</span>
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Опиши подробнее..."
            rows={5}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "14px 16px", borderRadius: "var(--radius)",
              border: "3px solid #DDD", fontFamily: "Nunito, sans-serif",
              fontSize: "clamp(0.95rem,3vw,1.05rem)", color: "var(--text)",
              background: "#fff", resize: "vertical", outline: "none",
            }}
          />
        </div>

        {/* Email */}
        <div>
          <div style={{ fontWeight: 800, fontSize: "clamp(0.9rem,3vw,1.05rem)", color: "var(--text)", marginBottom: 8 }}>
            Email для ответа <span style={{ color: "var(--muted)", fontWeight: 600 }}>(необязательно)</span>
          </div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "14px 16px", borderRadius: "var(--radius)",
              border: "3px solid #DDD", fontFamily: "Nunito, sans-serif",
              fontSize: "clamp(0.95rem,3vw,1.05rem)", color: "var(--text)",
              background: "#fff", outline: "none",
            }}
          />
        </div>

        {/* Ошибка валидации */}
        {error && (
          <div style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.95rem", textAlign: "center" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Статус отправки */}
        {status === "success" && (
          <div style={{ color: "var(--green)", fontWeight: 800, fontSize: "1.05rem", textAlign: "center" }}>
            ✅ Сообщение отправлено! Возвращаемся...
          </div>
        )}
        {status === "error" && (
          <div style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.95rem", textAlign: "center" }}>
            ❌ Не удалось отправить. Проверь интернет и попробуй ещё раз.
          </div>
        )}
      </div>

      <BottomBar>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onBack}>
          Назад
        </button>
        <button
          className="btn btn-primary"
          style={{ flex: 2 }}
          onClick={handleSubmit}
          disabled={status === "sending" || status === "success"}
        >
          {status === "sending" ? "Отправляем..." : "Отправить ✉️"}
        </button>
      </BottomBar>
    </div>
  );
}
