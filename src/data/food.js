import { FRUIT_SETS } from "./fruits";
import { VEGETABLE_SETS } from "./vegetables";
import { speak } from "../lib/audio";

export const FOOD_SETS = {
  fruits_simple:      FRUIT_SETS.simple,
  fruits_extra:       FRUIT_SETS.extra,
  fruits_exotic:      FRUIT_SETS.exotic,
  vegetables_simple:  VEGETABLE_SETS.simple,
  vegetables_extra:   VEGETABLE_SETS.extra,
  vegetables_exotic:  VEGETABLE_SETS.exotic,
};

export function playFoodSound(item) { speak(item.name); }
