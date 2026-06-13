export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomItemExceptKey(arr, getKey, excludeKey) {
  const f = arr.filter(x => getKey(x) !== excludeKey);
  return f.length ? randomItem(f) : arr[0];
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
