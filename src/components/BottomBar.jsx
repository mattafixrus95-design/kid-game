// Панель кнопок нижней части игры — все кнопки в едином стиле .btn-bar
export default function BottomBar({ children, onBack, maxWidth = 540 }) {
  return (
    <div style={{display:"flex",gap:10,width:"100%",maxWidth,justifyContent:"center",marginInline:"auto"}}>
      {onBack && <button className="btn btn-bar" onClick={onBack}>← Назад</button>}
      {children}
    </div>
  );
}
