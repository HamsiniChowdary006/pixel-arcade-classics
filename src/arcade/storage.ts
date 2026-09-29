import type { ArcadeSettings, GameId, ScoreEntry } from "./types";
const SCORE_KEY = "pixelArcade.highScores";
const SETTINGS_KEY = "pixelArcade.settings";
const PLAYER_KEY = "pixelArcade.player";
export const defaults: ArcadeSettings = { music: 55, sfx: 75, muted: false, crt: true };
const seed: Record<GameId, ScoreEntry[]> = {
  pinball: [{ initials: "HAM", score: 42500, date: "2026-09-29" }, { initials: "AAA", score: 31200, date: "2026-09-28" }],
  galaga: [{ initials: "NOVA", score: 28100, date: "2026-09-29" }],
  pacman: [{ initials: "PIX", score: 17650, date: "2026-09-29" }],
  tetris: [{ initials: "BLK", score: 22400, date: "2026-09-29" }],
};
export function loadSettings(): ArcadeSettings { try { return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") }; } catch { return defaults; } }
export function saveSettings(v: ArcadeSettings) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(v)); }
export function loadScores(): Record<GameId, ScoreEntry[]> { try { return { ...seed, ...JSON.parse(localStorage.getItem(SCORE_KEY) || "{}") }; } catch { return seed; } }
export function saveScore(game: GameId, initials: string, score: number) { const all = loadScores(); all[game] = [...all[game], { initials: initials.slice(0, 4).toUpperCase() || "AAA", score, date: new Date().toISOString().slice(0, 10) }].sort((a,b)=>b.score-a.score).slice(0,10); localStorage.setItem(SCORE_KEY, JSON.stringify(all)); localStorage.setItem(PLAYER_KEY, initials); return all; }
export function loadPlayer() { return localStorage.getItem(PLAYER_KEY) || "AAA"; }
