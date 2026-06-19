import { useRef } from "react";
import { shuffle } from "./random";

// Shuffle-bag: cycles through all items in random order before repeating any
export function useBag(items) {
  const queueRef = useRef([]);
  return function next(excludeKey, getKey) {
    let q = queueRef.current;
    if (q.length === 0) q = shuffle([...items]);
    if (excludeKey !== undefined && getKey && q.length > 1) {
      const idx = q.findIndex(x => getKey(x) !== excludeKey);
      if (idx > 0) { const t = q[0]; q[0] = q[idx]; q[idx] = t; }
    }
    const item = q.shift();
    queueRef.current = q;
    return item;
  };
}
