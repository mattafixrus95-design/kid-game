import { useState } from "react";
import { APP_VERSION } from "../version";

// Кнопка-шестерёнка: показывает версию приложения и позволяет вручную проверить обновление
export default function VersionButton() {
  const [open, setOpen] = useState(false);

  async function handleUpdate() {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) await reg.update();
    }
    window.location.reload();
  }

  return (
    <>
      <button onClick={()=>setOpen(true)} aria-label="Настройки"
        style={{
          position:"fixed", top:12, right:12, zIndex:1000,
          width:40, height:40, borderRadius:"50%",
          border:"none", background:"rgba(0,0,0,0.06)", color:"var(--text)",
          fontSize:"1.3rem", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
        ⚙️
      </button>
      {open && (
        <div onClick={()=>setOpen(false)} style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.4)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:1001,
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:"#fff", borderRadius:"var(--radius)", padding:"24px 28px",
            textAlign:"center", color:"var(--text)", minWidth:220,
          }}>
            <div style={{fontWeight:800, fontSize:"1.1rem", marginBottom:4}}>Развивашки</div>
            <div style={{color:"var(--muted)", marginBottom:16}}>Версия {APP_VERSION}</div>
            <button className="btn btn-primary" style={{width:"100%", marginBottom:8}} onClick={handleUpdate}>
              🔄 Обновить
            </button>
            <button className="btn btn-ghost" style={{width:"100%"}} onClick={()=>setOpen(false)}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}
