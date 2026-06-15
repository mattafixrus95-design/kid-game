import { SHAPE_COLOR } from "../data/shapes";

export default function ShapeSVG({ name, size = 130 }) {
  const c = SHAPE_COLOR;
  const s = size; const h = size;
  const vb = "0 0 100 100";
  const shapes = {
    "Круг":         <circle cx="50" cy="50" r="42" fill={c}/>,
    "Квадрат":      <rect x="8" y="8" width="84" height="84" rx="4" fill={c}/>,
    "Треугольник":  <polygon points="50,6 94,92 6,92" fill={c}/>,
    "Овал":         <ellipse cx="50" cy="50" rx="46" ry="30" fill={c}/>,
    "Прямоугольник":<rect x="4" y="24" width="92" height="52" rx="4" fill={c}/>,
    "Ромб":         <polygon points="50,6 92,50 50,94 8,50" fill={c}/>,
    "Трапеция":     <polygon points="20,80 80,80 92,20 8,20" fill={c}/>,
    "Звезда":       <polygon points="50,4 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={c}/>,
    "Полукруг":     <path d="M8,60 A42,42 0 0 1 92,60 Z" fill={c}/>,
    "Сердце":       <path d="M50,82 C20,62 6,46 6,32 A22,22 0 0 1 50,18 A22,22 0 0 1 94,32 C94,46 80,62 50,82Z" fill={c}/>,
    "Пятиугольник": <polygon points="50,6 94,38 76,90 24,90 6,38" fill={c}/>,
    "Шестиугольник":<polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill={c}/>,
    "Куб":          <>
                      <polygon points="20,30 70,10 70,60 20,80" fill={c}/>
                      <polygon points="70,10 94,22 94,72 70,60" fill={SHAPE_COLOR+"BB"}/>
                      <polygon points="20,80 70,60 94,72 44,92" fill={SHAPE_COLOR+"77"}/>
                    </>,
    "Шар":          <>
                      <circle cx="50" cy="50" r="42" fill={c}/>
                      <path d="M50,8 A42,42 0 0 1 50,92 Z" fill={SHAPE_COLOR+"BB"}/>
                      <ellipse cx="50" cy="76" rx="30" ry="10" fill={SHAPE_COLOR+"77"}/>
                    </>,
    "Конус":        <>
                      <polygon points="50,6 90,88 50,88" fill={SHAPE_COLOR+"BB"}/>
                      <polygon points="50,6 10,88 50,88" fill={c}/>
                      <ellipse cx="50" cy="88" rx="40" ry="10" fill={SHAPE_COLOR+"77"}/>
                    </>,
    "Цилиндр":      <>
                      <rect x="16" y="30" width="34" height="56" fill={c}/>
                      <rect x="50" y="30" width="34" height="56" fill={SHAPE_COLOR+"BB"}/>
                      <ellipse cx="50" cy="30" rx="34" ry="10" fill={SHAPE_COLOR+"DD"}/>
                      <ellipse cx="50" cy="86" rx="34" ry="10" fill={SHAPE_COLOR+"77"}/>
                    </>,
  };
  return (
    <svg width={s} height={h} viewBox={vb} xmlns="http://www.w3.org/2000/svg">
      {shapes[name] || <circle cx="50" cy="50" r="40" fill={c}/>}
    </svg>
  );
}
