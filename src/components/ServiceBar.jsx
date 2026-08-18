import { useState, useEffect } from "react";
import { APP_VERSION } from "../version";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import { trackFeedbackClick, trackDonateClick, trackAboutClick } from "../lib/analytics";

const CLOUDTIPS_URL = "https://pay.cloudtips.ru/p/1a2f9898";

function AboutModal({ onClose, onPrivacy }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1001,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "var(--radius)", padding: "28px 32px",
        textAlign: "center", color: "var(--text)", minWidth: 240, maxWidth: 320,
      }}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>🌟</div>
        <div style={{ fontWeight: 900, fontSize: "1.2rem", marginBottom: 4 }}>Развивашки</div>
        <div style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 20 }}>Версия {APP_VERSION}</div>
        <button className="btn btn-ghost" style={{ width: "100%", marginBottom: 10 }} onClick={onPrivacy}>
          Политика конфиденциальности
        </button>
        <button className="btn btn-ghost" style={{ width: "100%" }} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
}

export default function ServiceBar({ onBack, onFeedback }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Системная/внутренняя кнопка "Назад" во время просмотра политики
  // должна вернуть на экран "О приложении", а не закрыть/уйти из приложения.
  useEffect(() => {
    function onPopState() {
      setPrivacyOpen(open => {
        if (!open) return open;
        setAboutOpen(true);
        return false;
      });
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function openPrivacy() {
    setAboutOpen(false);
    setPrivacyOpen(true);
    window.history.pushState({ overlay: "privacy" }, "", "#privacy");
  }

  return (
    <>
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 0,
        background: "rgba(255,255,255,0.95)",
        borderTop: "1.5px solid #F0F0F0",
        padding: "6px 12px 10px",
        zIndex: 100,
      }}>
        {onBack && <button onClick={onBack} style={btnStyle}>
          <span style={iconStyle}>◀️</span>
          <span style={labelStyle}>Назад</span>
        </button>}
        <button onClick={() => { trackFeedbackClick(); onFeedback(); }} style={btnStyle}>
          <span style={iconStyle}>✉️</span>
          <span style={labelStyle}>Написать разработчику</span>
        </button>
        <button onClick={() => { trackDonateClick(); window.open(CLOUDTIPS_URL, "_blank"); }} style={btnStyle}>
          <span style={iconStyle}>💰</span>
          <span style={labelStyle}>Поддержать</span>
        </button>
        <button onClick={() => { trackAboutClick(); setAboutOpen(true); }} style={btnStyle}>
          <span style={iconStyle}>ℹ️</span>
          <span style={labelStyle}>О приложении</span>
        </button>
      </div>

      {/* Версия — мелко в правом нижнем углу, над ServiceBar */}
      <div style={{
        position: "fixed", bottom: 66, right: 14,
        fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600, pointerEvents: "none", zIndex: 101,
      }}>
        v{APP_VERSION}
      </div>

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} onPrivacy={openPrivacy}/>}
      {privacyOpen && <PrivacyPolicyScreen onBack={() => window.history.back()}/>}
    </>
  );
}

const btnStyle = {
  flex: 1, background: "none", border: "none", cursor: "pointer",
  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
  padding: "4px 6px",
};

const iconStyle = { fontSize: "1.4rem", lineHeight: 1 };

const labelStyle = {
  fontSize: "clamp(0.6rem,2.2vw,0.72rem)", fontWeight: 700,
  color: "var(--muted)", textAlign: "center", lineHeight: 1.1,
};
