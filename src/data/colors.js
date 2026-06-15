export const COLOR_SETS = {
  basic: [
    { name: "Красный",    css: "#E53935", forms: { m: "Красный",  f: "Красная",  n: "Красное" } },
    { name: "Жёлтый",    css: "#FDD835", forms: { m: "Жёлтый",   f: "Жёлтая",   n: "Жёлтое" } },
    { name: "Зелёный",   css: "#43A047", forms: { m: "Зелёный",  f: "Зелёная",  n: "Зелёное" } },
    { name: "Синий",     css: "#1E88E5", forms: { m: "Синий",    f: "Синяя",    n: "Синее" } },
  ],
  additional: [
    { name: "Оранжевый", css: "#FB8C00" },
    { name: "Фиолетовый",css: "#8E24AA" },
    { name: "Розовый",   css: "#EC407A" },
    { name: "Белый",     css: "#F5F5F5" },
    { name: "Чёрный",    css: "#212121" },
  ],
  shades: [
    { name: "Голубой",    css: "#29B6F6" },
    { name: "Салатовый",  css: "#9CCC65" },
    { name: "Коричневый", css: "#6D4C41" },
    { name: "Серый",      css: "#757575" },
    { name: "Бирюзовый",  css: "#26C6DA" },
  ],
};

export const isLightColor = (c) => c.css === "#F5F5F5";
