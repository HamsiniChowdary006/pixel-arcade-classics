import { CanvasEngine } from "../engine";
import type { EngineHooks } from "../../arcade/types";
const SHAPES: Record<string, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};
const COLORS: Record<string, string> = {
  I: "#1AF2FF",
  O: "#FFD83C",
  T: "#7D5CFF",
  S: "#4DFF73",
  Z: "#FF5A4F",
  J: "#4984ff",
  L: "#FF2E94",
};
export class TetrisGame extends CanvasEngine {
  private board = Array.from({ length: 20 }, () => Array(10).fill(""));
  private piece = this.make();
  private next = this.make();
  private hold = "";
  private canHold = true;
  private score = 0;
  private lines = 0;
  private level = 1;
  private drop = 0;
  private press = new Set<string>();
  private flash = 0;
  private piecesPlaced = 0;
  constructor(c: HTMLCanvasElement, h: EngineHooks) {
    super(c, h);
    this.emit();
  }
  private make() {
    const keys = Object.keys(SHAPES);
    const type = keys[Math.floor(Math.random() * keys.length)];
    return { type, shape: SHAPES[type].map((r) => [...r]), x: 3, y: 0 };
  }
  private emit() {
    this.hooks.update({
      score: this.score,
      level: this.level,
      lines: this.lines,
      next: this.next.type,
      hold: this.hold,
      piecesPlaced: this.piecesPlaced,
    });
  }
  key(code: string, down: boolean) {
    super.key(code, down);
    if (down && !this.press.has(code)) {
      this.press.add(code);
      if (code === "ArrowLeft") this.move(-1, 0);
      if (code === "ArrowRight") this.move(1, 0);
      if (code === "ArrowUp") this.rotate();
      if (code === "Space") this.hard();
      if (code === "KeyC") this.swap();
    }
    if (!down) this.press.delete(code);
  }
  private valid(shape = this.piece.shape, x = this.piece.x, y = this.piece.y) {
    return shape.every((r, dy) =>
      r.every(
        (v, dx) =>
          !v ||
          (x + dx >= 0 &&
            x + dx < 10 &&
            y + dy < 20 &&
            (y + dy < 0 || !this.board[y + dy][x + dx])),
      ),
    );
  }
  private move(dx: number, dy: number) {
    if (this.valid(this.piece.shape, this.piece.x + dx, this.piece.y + dy)) {
      this.piece.x += dx;
      this.piece.y += dy;
      return true;
    }
    return false;
  }
  private rotate() {
    const n = this.piece.shape[0].map((_, i) => this.piece.shape.map((r) => r[i]).reverse());
    for (const k of [0, -1, 1, -2, 2])
      if (this.valid(n, this.piece.x + k, this.piece.y)) {
        this.piece.shape = n;
        this.piece.x += k;
        this.hooks.sfx("move");
        return;
      }
  }
  private hard() {
    let n = 0;
    while (this.move(0, 1)) n++;
    this.score += n * 2;
    this.lock();
  }
  private swap() {
    if (!this.canHold) return;
    const t = this.hold;
    this.hold = this.piece.type;
    this.piece = t ? { type: t, shape: SHAPES[t].map((r) => [...r]), x: 3, y: 0 } : this.next;
    this.next = t ? this.next : this.make();
    this.canHold = false;
    this.emit();
  }
  private lock() {
    this.piecesPlaced++;
    this.piece.shape.forEach((r, dy) =>
      r.forEach((v, dx) => {
        if (v && this.piece.y + dy >= 0)
          this.board[this.piece.y + dy][this.piece.x + dx] = this.piece.type;
      }),
    );
    const before = this.board.length;
    this.board = this.board.filter((r) => r.some((v) => !v));
    const count = before - this.board.length;
    while (this.board.length < 20) this.board.unshift(Array(10).fill(""));
    if (count) {
      this.lines += count;
      this.score += [0, 100, 300, 500, 800][count] * this.level;
      this.level = 1 + Math.floor(this.lines / 10);
      this.flash = 0.22;
      this.hooks.sfx("clear");
    }
    this.piece = this.next;
    this.piece.x = 3;
    this.piece.y = 0;
    this.next = this.make();
    this.canHold = true;
    this.emit();
    if (!this.valid()) {
      this.running = false;
      this.hooks.gameOver(this.score);
    }
  }
  protected update(dt: number) {
    this.flash = Math.max(0, this.flash - dt);
    this.drop += dt * (this.keys.has("ArrowDown") ? 12 : 1);
    const speed = Math.max(0.1, 0.75 - (this.level - 1) * 0.055);
    if (this.drop > speed) {
      if (!this.move(0, 1)) this.lock();
      this.drop = 0;
    }
  }
  protected render() {
    this.clear();
    const size = 27,
      ox = 65,
      oy = 28;
    this.ctx.strokeStyle = "#181f47";
    this.ctx.lineWidth = 1;
    for (let y = 0; y < 20; y++)
      for (let x = 0; x < 10; x++) {
        this.ctx.strokeRect(ox + x * size, oy + y * size, size, size);
        const v = this.board[y][x];
        if (v) this.block(ox + x * size, oy + y * size, COLORS[v]);
      }
    let gy = this.piece.y;
    while (this.valid(this.piece.shape, this.piece.x, gy + 1)) gy++;
    this.piece.shape.forEach((r, dy) =>
      r.forEach((v, dx) => {
        if (v) {
          this.ctx.globalAlpha = 0.25;
          this.block(
            ox + (this.piece.x + dx) * size,
            oy + (gy + dy) * size,
            COLORS[this.piece.type],
          );
          this.ctx.globalAlpha = 1;
          this.block(
            ox + (this.piece.x + dx) * size,
            oy + (this.piece.y + dy) * size,
            COLORS[this.piece.type],
          );
        }
      }),
    );
    if (this.flash) {
      this.ctx.fillStyle = "#EBEBD1";
      this.ctx.globalAlpha = this.flash;
      this.ctx.fillRect(ox, oy, 270, 540);
      this.ctx.globalAlpha = 1;
    }
  }
  private block(x: number, y: number, c: string) {
    this.rect(x + 2, y + 2, 23, 23, c);
    this.ctx.fillStyle = "#EBEBD1";
    this.ctx.globalAlpha = 0.35;
    this.ctx.fillRect(x + 4, y + 4, 15, 3);
    this.ctx.globalAlpha = 1;
  }
}
