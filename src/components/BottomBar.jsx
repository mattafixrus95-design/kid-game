// Панель кнопок нижней части игры
export default function BottomBar({ children, onBack, maxWidth = 540 }) {
  return (
    <div style={{display:"flex",gap:12,width:"100%",maxWidth}}>
      {onBack && <button className="btn btn-back" onClick={onBack}>← Назад</button>}
      {children}
    </div>
  );
}
