// Стандартная шапка игрового экрана
export default function GameHeader({ onBack, label, record, streak }) {
  return (
    <div style={{width:"100%",maxWidth:560,display:"flex",flexDirection:"column",gap:4}}>
      <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:12}}>
        {label && <div style={{fontSize:"0.85rem",color:"var(--muted)",fontWeight:600,marginRight:"auto"}}>{label}</div>}
        <div style={{fontWeight:800,fontSize:"clamp(0.9rem,2.5vw,1.1rem)",color:"var(--muted)"}}>
          🏆{record} 🔥{streak}
        </div>
      </div>
      <button className="btn btn-back" onClick={onBack}>← Назад</button>
    </div>
  );
}
