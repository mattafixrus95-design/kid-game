// Стандартная шапка игрового экрана
export default function GameHeader({ onBack, label, record, streak }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:560}}>
      <button className="btn btn-back" onClick={onBack}>← Назад</button>
      {label && <div style={{fontSize:"0.9rem",color:"var(--muted)",fontWeight:600}}>{label}</div>}
      <div style={{fontWeight:800,fontSize:"clamp(1rem,3vw,1.2rem)",color:"var(--muted)"}}>
        🏆{record} 🔥{streak}
      </div>
    </div>
  );
}
