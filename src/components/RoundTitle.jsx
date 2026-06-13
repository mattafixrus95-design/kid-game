// Заголовок + подзаголовок игрового раунда
export default function RoundTitle({ title, subtitle }) {
  return (
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:"clamp(1.2rem,4vw,1.6rem)",fontWeight:700,color:"var(--text)"}}>{title}</div>
      {subtitle && (
        <div style={{fontSize:"clamp(1.6rem,6vw,2.4rem)",fontWeight:900,color:"var(--text)",marginTop:4}}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
