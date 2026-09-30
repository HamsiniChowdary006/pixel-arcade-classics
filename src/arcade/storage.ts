import type { ArcadeSettings } from "./types";
const SETTINGS_KEY = "pixelArcade.settings";
export const defaults: ArcadeSettings = { music: 55, sfx: 75, muted: false, crt: true };
export function loadSettings(): ArcadeSettings {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return defaults;
  }
}
export function saveSettings(v: ArcadeSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(v));
}
