// Панель кнопок нижней части игры
export default function BottomBar({ children, maxWidth = 540 }) {
  return (
    <div style={{display:"flex",gap:12,width:"100%",maxWidth}}>
      {children}
    </div>
  );
}
