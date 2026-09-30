export type GameId = "pinball" | "galaga" | "pacman" | "tetris";
export type Screen = "home" | "select" | "setup" | "game" | "card" | "settings" | "controls";
export type SfxName =
  "move" | "select" | "coin" | "hit" | "shoot" | "pellet" | "explode" | "clear" | "over" | "high";
export interface ArcadeSettings {
  music: number;
  sfx: number;
  muted: boolean;
  crt: boolean;
}
export interface GameSnapshot {
  score: number;
  lives?: number;
  level?: number;
  lines?: number;
  ball?: number;
  combo?: number;
  wave?: number;
  next?: string;
  hold?: string;
  ballsUsed?: number;
  bestCombo?: number;
  targetsHit?: number;
  enemiesDefeated?: number;
  pelletsCollected?: number;
  piecesPlaced?: number;
}
export interface EngineHooks {
  update: (snapshot: GameSnapshot) => void;
  gameOver: (score: number) => void;
  sfx: (name: SfxName) => void;
}
export interface GameEngine {
  start(): void;
  pause(value: boolean): void;
  key(code: string, down: boolean): void;
  destroy(): void;
}
export const GAME_META: Record<
  GameId,
  { title: string; subtitle: string; accent: string; controls: string[] }
> = {
  pinball: {
    title: "PINBALL",
    subtitle: "PHYSICS",
    accent: "pink",
    controls: ["A LEFT FLIPPER", "D RIGHT FLIPPER", "SPACE LAUNCH"],
  },
  galaga: {
    title: "STARFIGHTER",
    subtitle: "SHOOTER",
    accent: "cyan",
    controls: ["← → MOVE", "SPACE SHOOT"],
  },
  pacman: {
    title: "MAZE RUNNER",
    subtitle: "MAZE",
    accent: "yellow",
    controls: ["ARROW KEYS MOVE"],
  },
  tetris: {
    title: "BLOCK STACK",
    subtitle: "PUZZLE",
    accent: "green",
    controls: ["← → MOVE", "↑ ROTATE", "↓ DROP", "SPACE HARD DROP", "C HOLD"],
  },
};
