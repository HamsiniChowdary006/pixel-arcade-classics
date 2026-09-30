import { CanvasEngine } from "../engine";
import type { EngineHooks } from "../../arcade/types";
type Obj = {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  alive?: boolean;
  kind?: number;
  cool?: number;
};
export class GalagaGame extends CanvasEngine {
  private player = { x: 200, y: 555 };
  private shots: Obj[] = [];
  private enemyShots: Obj[] = [];
  private enemies: Obj[] = [];
  private stars = Array.from({ length: 70 }, (_, i) => ({ x: (i * 73) % 400, y: (i * 47) % 600 }));
  private score = 0;
  private lives = 3;
  private wave = 1;
  private enemiesDefeated = 0;
  private cooldown = 0;
  private time = 0;
  constructor(c: HTMLCanvasElement, h: EngineHooks) {
    super(c, h);
    this.spawn();
  }
  private emit() {
    this.hooks.update({
      score: this.score,
      lives: this.lives,
      wave: this.wave,
      enemiesDefeated: this.enemiesDefeated,
    });
  }
  private spawn() {
    this.enemies = [];
    for (let r = 0; r < 4; r++)
      for (let x = 0; x < 8; x++)
        this.enemies.push({
          x: 65 + x * 39,
          y: 75 + r * 38,
          alive: true,
          kind: r % 3,
          cool: 1 + Math.random() * 4,
        });
    this.emit();
  }
  protected update(dt: number) {
    this.time += dt;
    this.cooldown -= dt;
    if (this.keys.has("ArrowLeft")) this.player.x = Math.max(25, this.player.x - 230 * dt);
    if (this.keys.has("ArrowRight")) this.player.x = Math.min(375, this.player.x + 230 * dt);
    if (this.keys.has("Space") && this.cooldown <= 0) {
      this.shots.push({ x: this.player.x, y: 535, vy: -430 });
      this.cooldown = 0.2;
      this.hooks.sfx("shoot");
    }
    for (const s of this.shots) s.y += s.vy! * dt;
    for (const s of this.enemyShots) s.y += s.vy! * dt;
    for (const [i, e] of this.enemies.entries()) {
      if (!e.alive) continue;
      e.x += Math.sin(this.time * 1.5 + i) * 12 * dt;
      e.cool = (e.cool || 0) - dt;
      if (e.cool <= 0 && Math.random() < 0.015) {
        this.enemyShots.push({ x: e.x, y: e.y, vy: 170 + this.wave * 8 });
        e.cool = 2 + Math.random() * 4;
      }
      if (Math.random() < 0.0005 * this.wave) {
        e.vy = 100;
        e.vx = (this.player.x - e.x) * 0.15;
      }
      if (e.vy) {
        e.x += (e.vx || 0) * dt;
        e.y += e.vy * dt;
        if (e.y > 580) {
          e.y = 70 + (i % 4) * 38;
          e.vy = 0;
        }
      }
      for (const s of this.shots)
        if (Math.abs(s.x - e.x) < 15 && Math.abs(s.y - e.y) < 14) {
          e.alive = false;
          s.y = -50;
          this.score += 100 * (1 + (e.kind || 0));
          this.enemiesDefeated++;
          this.hooks.sfx("explode");
          this.emit();
        }
      if (e.alive && Math.abs(e.x - this.player.x) < 22 && Math.abs(e.y - this.player.y) < 22) {
        e.alive = false;
        this.lives--;
        this.enemyShots.length = 0;
        this.player.x = 200;
        this.hooks.sfx("hit");
        this.emit();
        if (this.lives <= 0) {
          this.running = false;
          this.hooks.gameOver(this.score);
          return;
        }
      }
    }
    this.enemyShots = this.enemyShots.filter((s) => {
      if (Math.abs(s.x - this.player.x) < 15 && Math.abs(s.y - this.player.y) < 15) {
        this.lives--;
        this.hooks.sfx("hit");
        this.emit();
        if (this.lives <= 0) {
          this.running = false;
          this.hooks.gameOver(this.score);
        }
        return false;
      }
      return s.y < 620;
    });
    this.shots = this.shots.filter((s) => s.y > -20);
    if (this.enemies.every((e) => !e.alive)) {
      this.wave++;
      this.spawn();
    }
  }
  protected render() {
    this.clear();
    for (const s of this.stars) {
      this.rect(s.x, s.y, 2, 2, "#7D5CFF");
      s.y = (s.y + 1) % 600;
    }
    for (const e of this.enemies)
      if (e.alive) {
        const col = e.kind === 0 ? "#FF2E94" : e.kind === 1 ? "#4DFF73" : "#FFD83C";
        this.rect(e.x - 11, e.y - 7, 22, 12, col);
        this.rect(e.x - 6, e.y - 13, 12, 5, col);
        this.rect(e.x - 16, e.y + 6, 7, 5, col);
        this.rect(e.x + 9, e.y + 6, 7, 5, col);
      }
    for (const s of this.shots) this.rect(s.x - 2, s.y, 4, 12, "#1AF2FF");
    for (const s of this.enemyShots) this.rect(s.x - 2, s.y, 4, 10, "#FF5A4F");
    const x = this.player.x,
      y = this.player.y;
    this.rect(x - 5, y - 18, 10, 24, "#EBEBD1");
    this.rect(x - 15, y - 5, 30, 12, "#1AF2FF");
    this.rect(x - 20, y + 5, 9, 10, "#FF2E94");
    this.rect(x + 11, y + 5, 9, 10, "#FF2E94");
  }
}
