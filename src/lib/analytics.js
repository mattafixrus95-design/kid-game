// Продуктовая аналитика (Яндекс Метрика). Единственное место в проекте,
// откуда разрешено обращаться к window.ym — компоненты вызывают только
// функции из этого модуля.

const COUNTER_ID = 111721456;

const SKILL_EVENTS = {
  speech:    "open_skill_speech",
  memory:    "open_skill_memory",
  logic:     "open_skill_logic",
  attention: "open_skill_attention",
  math:      "open_skill_math",
};

function getPlatform() {
  if (typeof window === "undefined") return "web";
  if (window.APP_PLATFORM === "apk_webview") return "apk_webview";

  const isStandalone =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  if (isStandalone) return "pwa";

  return "web";
}

export function trackEvent(name, params = {}) {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.ym !== "function") return;

    window.ym(COUNTER_ID, "reachGoal", name, {
      ...params,
      platform: getPlatform(),
    });
  } catch {
    // Аналитика не должна ломать приложение
  }
}

export function trackSkillOpen(skillId) {
  const eventName = SKILL_EVENTS[skillId];
  if (!eventName) return;
  trackEvent(eventName);
}

export function trackMechanicStart(mechanicId) {
  if (!mechanicId) return;
  trackEvent("mechanic_start", { mechanic: mechanicId });
}

export function trackFeedbackClick() {
  trackEvent("feedback_click");
}

export function trackDonateClick() {
  trackEvent("donate_click");
}

export function trackAboutClick() {
  trackEvent("about_click");
}
