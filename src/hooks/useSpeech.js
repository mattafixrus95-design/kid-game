import { useEffect, useRef } from "react";
import { speak, speakSequence, stopAllAudio } from "../lib/audio";

export function useStopAudioOnUnmount() {
  useEffect(() => () => stopAllAudio(), []);
}

// Озвучивает текущий элемент: при первом появлении — вступительная фраза + название,
// при последующих сменах — только название.
export function useIntroSpeech(name, introText) {
  const introRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!introRef.current) { introRef.current = true; speakSequence(introText, name); }
      else { speak(name); }
    }, 400);
    return () => clearTimeout(t);
  }, [name]);
}
