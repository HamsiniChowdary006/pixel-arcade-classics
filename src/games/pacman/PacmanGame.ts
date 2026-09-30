import { CanvasEngine } from "../engine";
import type { EngineHooks } from "../../arcade/types";

const RAW = [
  "#################",
  "#.......#.......#",
  "#.###.#.#.#.###.#",
  "#o#...#...#...#o#",
  "#.#.#####.###.#.#",
  "#...............#",
  "###.#.##-##.#.###",
  "#...#.#   #.#...#",
  "#.###.#   #.###.#",
  "#.....#####.....#",
  "#.###.......###.#",
  "#...#.#####.#...#",
  "###.#...#...#.###",
  "#.......#.......#",
  "#.#####.#.#####.#",
  "#o............o.#",
  "#################",
];

type Direction = [number, number];
type Enemy = { x: number; y: number; color: string; mode: number; dir: Direction };

const DIRECTIONS: Direction[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export class PacmanGame extends CanvasEngine {
  private grid: string[][] = RAW.map((row) => row.split(""));
  private player = { x: 1, y: 1, dir: [1, 0] as Direction, want: [1, 0] as Direction };
  private enemies: Enemy[] = [
    { x: 8, y: 7, color: "#FF2E94", mode: 0, dir: [1, 0] },
    { x: 7, y: 8, color: "#1AF2FF", mode: 1, dir: [-1, 0] },
    { x: 9, y: 8, color: "#FF5A4F", mode: 2, dir: [0, -1] },
    { x: 8, y: 8, color: "#7D5CFF", mode: 3, dir: [0, 1] },
  ];
  private score = 0;
  private lives = 3;
  private level = 1;
  private power = 0;
  private step = 0;
  private pelletsCollected = 0;
  private enemiesDefeated = 0;

  constructor(canvas: HTMLCanvasElement, hooks: EngineHooks) {
    super(canvas, hooks);
    this.emit();
  }

  private emit() {
    this.hooks.update({
      score: this.score,
      lives: this.lives,
      level: this.level,
      pelletsCollected: this.pelletsCollected,
      enemiesDefeated: this.enemiesDefeated,
    });
  }

  override key(code: string, down: boolean) {
    super.key(code, down);
    if (!down) return;
    if (code === "ArrowLeft") this.player.want = [-1, 0];
    if (code === "ArrowRight") this.player.want = [1, 0];
    if (code === "ArrowUp") this.player.want = [0, -1];
    if (code === "ArrowDown") this.player.want = [0, 1];
  }

  private open(x: number, y: number) {
    return y >= 0 && y < this.grid.length && x >= 0 && x < 17 && this.grid[y]?.[x] !== "#";
  }

  protected update(dt: number) {
    this.power = Math.max(0, this.power - dt);
    this.step += dt;
    if (this.step < 0.115 - Math.min(0.035, this.level * 0.004)) return;
    this.step = 0;

    const p = this.player;
    if (this.open(p.x + p.want[0], p.y + p.want[1])) p.dir = p.want;
    if (this.open(p.x + p.dir[0], p.y + p.dir[1])) {
      p.x += p.dir[0];
      p.y += p.dir[1];
    }

    const row = this.grid[p.y];
    const cell = row?.[p.x] ?? "#";
    if ((cell === "." || cell === "o") && row) {
      row[p.x] = " ";
      this.pelletsCollected++;
      this.score += cell === "o" ? 50 : 10;
      if (cell === "o") this.power = 7;
      this.hooks.sfx("pellet");
      this.emit();
    }

    for (const e of this.enemies) {
      const valid = DIRECTIONS.filter(
        (d) => this.open(e.x + d[0], e.y + d[1]) && !(d[0] === -e.dir[0] && d[1] === -e.dir[1]),
      );
      if (valid.length > 0) {
        let tx = p.x;
        let ty = p.y;
        if (e.mode === 1) {
          tx += p.dir[0] * 3;
          ty += p.dir[1] * 3;
        } else if (e.mode === 2 && Math.floor(performance.now() / 4000) % 2) {
          tx = 1;
          ty = 15;
        } else if (e.mode === 3) {
          tx = Math.random() * 17;
          ty = Math.random() * 17;
        }
        valid.sort(
          (a, b) =>
            Math.abs(e.x + a[0] - tx) +
            Math.abs(e.y + a[1] - ty) -
            (Math.abs(e.x + b[0] - tx) + Math.abs(e.y + b[1] - ty)),
        );
        const choice = this.power ? valid[valid.length - 1] : valid[0];
        if (choice) {
          e.dir = choice;
          e.x += e.dir[0];
          e.y += e.dir[1];
        }
      }

      if (e.x === p.x && e.y === p.y) {
        if (this.power) {
          this.score += 200;
          this.enemiesDefeated++;
          e.x = 8;
          e.y = 8;
          this.hooks.sfx("explode");
        } else {
          this.lives -= 1;
          this.hooks.sfx("hit");
          p.x = 1;
          p.y = 1;
          this.enemies.forEach((enemy, i) => {
            enemy.x = 7 + (i % 3);
            enemy.y = 8;
          });
          this.emit();
          if (this.lives <= 0) {
            this.running = false;
            this.hooks.gameOver(this.score);
          }
        }
      }
    }

    if (!this.grid.some((line) => line.some((value) => value === "." || value === "o"))) {
      this.level += 1;
      this.grid = RAW.map((line) => line.split(""));
      p.x = 1;
      p.y = 1;
      this.emit();
    }
  }

  protected render() {
    this.clear();
    const size = 32;
    const ox = 28;
    const oy = 28;
    for (let y = 0; y < 17; y += 1) {
      for (let x = 0; x < 17; x += 1) {
        const value = this.grid[y]?.[x];
        if (value === "#") {
          this.ctx.strokeStyle = "#1A66FF";
          this.ctx.lineWidth = 3;
          this.ctx.strokeRect(ox + x * size + 3, oy + y * size + 3, size - 6, size - 6);
        } else if (value === ".") {
          this.rect(ox + x * size + 14, oy + y * size + 14, 4, 4, "#FFD83C");
        } else if (value === "o") {
          this.rect(ox + x * size + 10, oy + y * size + 10, 12, 12, "#EBEBD1");
        }
      }
    }
    const px = ox + this.player.x * size + 16;
    const py = oy + this.player.y * size + 16;
    const mouth = 0.2 * Math.sin(performance.now() / 80);
    this.ctx.fillStyle = "#FFD83C";
    this.ctx.beginPath();
    this.ctx.arc(px, py, 12, mouth, Math.PI * 2 - mouth);
    this.ctx.lineTo(px, py);
    this.ctx.fill();
    for (const e of this.enemies) {
      const x = ox + e.x * size + 16;
      const y = oy + e.y * size + 16;
      this.ctx.fillStyle = this.power ? "#7D5CFF" : e.color;
      this.ctx.beginPath();
      this.ctx.arc(x, y - 2, 12, Math.PI, 0);
      this.ctx.lineTo(x + 12, y + 11);
      this.ctx.lineTo(x + 6, y + 6);
      this.ctx.lineTo(x, y + 11);
      this.ctx.lineTo(x - 6, y + 6);
      this.ctx.lineTo(x - 12, y + 11);
      this.ctx.fill();
      this.rect(x - 6, y - 4, 4, 4, "#EBEBD1");
      this.rect(x + 3, y - 4, 4, 4, "#EBEBD1");
    }
  }
}
