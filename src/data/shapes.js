const shapeImages = import.meta.glob('/src/assets/shapes/*.png', { eager: true });
function img(name) {
  return shapeImages[`/src/assets/shapes/${name}.png`]?.default;
}

export const SHAPE_SETS = {
  simple: [
    { name: "Круг",        image: img("Круг") },
    { name: "Квадрат",     image: img("Квадрат") },
    { name: "Треугольник", image: img("Треугольник") },
    { name: "Овал",        image: img("Овал") },
  ],
  composite: [
    { name: "Прямоугольник", image: img("Прямоугольник") },
    { name: "Ромб",          image: img("Ромб") },
    { name: "Трапеция",      image: img("Трапеция") },
    { name: "Звезда",        image: img("Звезда") },
    { name: "Полукруг",      image: img("Полукруг") },
    { name: "Сердце",        image: img("Сердце") },
    { name: "Пятиугольник",  image: img("Пятиугольник") },
    { name: "Шестиугольник", image: img("Шестиугольник") },
  ],
  volumetric: [
    { name: "Куб",      image: img("Куб") },
    { name: "Шар",      image: img("Шар") },
    { name: "Конус",    image: img("Конус") },
    { name: "Цилиндр",  image: img("Цилиндр") },
  ],
};

export const SHAPE_COLOR = "#FF6B35";
