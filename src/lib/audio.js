export function speak(text, onEnd) {
  if (!window.speechSynthesis) { if (onEnd) onEnd(); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ru-RU"; u.rate = 0.8;
  const voices = window.speechSynthesis.getVoices();
  const rv = voices.find(v => v.lang.startsWith("ru"));
  if (rv) u.voice = rv;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

export function speakSequence(intro, main) {
  speak(intro, () => setTimeout(() => speak(main), 300));
}

// Проиграть звуковой файл, при отсутствии/ошибке — озвучить текст
export function playSound(file, fallbackText) {
  if (file) {
    try {
      const audio = new Audio(new URL(`../assets/sounds/${file}`, import.meta.url).href);
      audio.play().catch(() => speak(fallbackText));
      return;
    } catch (e) {
      speak(fallbackText);
      return;
    }
  }
  speak(fallbackText);
}

export function playSuccess() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(523, ctx.currentTime);
    o.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
    o.frequency.setValueAtTime(784, ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.6);
  } catch (e) {}
}

export function playError() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "sawtooth"; o.frequency.setValueAtTime(200, ctx.currentTime);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}
