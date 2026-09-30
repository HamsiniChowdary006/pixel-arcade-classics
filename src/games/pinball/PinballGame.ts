import { CanvasEngine } from "../engine";
import type { EngineHooks } from "../../arcade/types";

type Ball = { x: number; y: number; vx: number; vy: number; r: number; spin: number };
type Light = { x: number; y: number; active: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };
type Popup = { x: number; y: number; text: string; life: number };

export class PinballGame extends CanvasEngine {
  private ball: Ball = { x: 350, y: 520, vx: 0, vy: 0, r: 7, spin: 0 };
  private score = 0;
  private balls = 3;
  private ballsUsed = 0;
  private combo = 1;
  private bestCombo = 1;
  private targetsHit = 0;
  private launched = false;
  private rampCooldown = 0;
  private bumpers: Light[] = [
    { x: 130, y: 145, active: 0 },
    { x: 245, y: 120, active: 0 },
    { x: 300, y: 220, active: 0 },
    { x: 120, y: 275, active: 0 },
  ];
  private targets: Light[] = [
    { x: 72, y: 342, active: 0 },
    { x: 112, y: 342, active: 0 },
    { x: 152, y: 342, active: 0 },
    { x: 192, y: 342, active: 0 },
    { x: 232, y: 342, active: 0 },
  ];
  private drops = [
    { x: 90, y: 392, down: false, active: 0 },
    { x: 130, y: 392, down: false, active: 0 },
    { x: 170, y: 392, down: false, active: 0 },
  ];
  private rollovers = [
    { x: 74, active: 0 },
    { x: 112, active: 0 },
    { x: 150, active: 0 },
  ];
  private particles: Particle[] = [];
  private popups: Popup[] = [];

  constructor(canvas: HTMLCanvasElement, hooks: EngineHooks) {
    super(canvas, hooks);
    this.emit();
  }

  private emit() {
    this.hooks.update({
      score: this.score,
      ball: this.balls,
      combo: this.combo,
      ballsUsed: this.ballsUsed,
      bestCombo: this.bestCombo,
      targetsHit: this.targetsHit,
    });
  }

  private addScore(points: number, x: number, y: number) {
    this.score += points * this.combo;
    this.popups.push({ x, y, text: `+${points * this.combo}`, life: 0.8 });
    this.emit();
  }

  private burst(x: number, y: number, color: string) {
    for (let i = 0; i < 7; i++) {
      const angle = (Math.PI * 2 * i) / 7;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * 45,
        vy: Math.sin(angle) * 45,
        life: 0.45,
        color,
      });
    }
  }

  private circleBounce(cx: number, cy: number, radius: number, points: number) {
    const b = this.ball;
    const dx = b.x - cx;
    const dy = b.y - cy;
    const distance = Math.hypot(dx, dy) || 1;
    const minimum = radius + b.r;
    if (distance >= minimum) return false;
    const nx = dx / distance;
    const ny = dy / distance;
    b.x = cx + nx * minimum;
    b.y = cy + ny * minimum;
    const velocity = b.vx * nx + b.vy * ny;
    if (velocity < 0) {
      b.vx -= 1.9 * velocity * nx;
      b.vy -= 1.9 * velocity * ny;
    }
    b.vx *= 0.99;
    b.vy *= 0.99;
    this.addScore(points, b.x, b.y);
    this.burst(b.x, b.y, "#FFD83C");
    this.hooks.sfx("hit");
    return true;
  }

  private flipperHit(ax: number, ay: number, bx: number, by: number, active: boolean) {
    const b = this.ball;
    const dx = bx - ax;
    const dy = by - ay;
    const length = dx * dx + dy * dy;
    const t = Math.max(0, Math.min(1, ((b.x - ax) * dx + (b.y - ay) * dy) / length));
    const px = ax + t * dx;
    const py = ay + t * dy;
    const distance = Math.hypot(b.x - px, b.y - py);
    if (distance > b.r + 10 || b.vy <= 0) return;
    const nx = (b.x - px) / (distance || 1);
    const ny = (b.y - py) / (distance || 1);
    b.x = px + nx * (b.r + 10);
    b.y = py + ny * (b.r + 10);
    const impulse = active ? 620 : 390;
    b.vx += nx * impulse * 0.35;
    b.vy = -impulse - Math.abs(b.vx) * 0.2;
    b.spin += active ? 12 : 5;
    this.addScore(50, b.x, b.y);
    this.burst(b.x, b.y, "#FF2E94");
    this.hooks.sfx("hit");
  }

  protected update(dt: number) {
    const b = this.ball;
    const left = this.keys.has("KeyA");
    const right = this.keys.has("KeyD");
    if (!this.launched) {
      b.x = 350;
      b.y = 520;
      b.vx = 0;
      b.vy = 0;
      if (this.keys.has("Space")) {
        this.launched = true;
        b.vx = -175;
        b.vy = -650;
        this.hooks.sfx("shoot");
      }
    } else {
      b.vy += 470 * dt;
      b.vx *= Math.pow(0.997, dt * 60);
      b.vy *= Math.pow(0.999, dt * 60);
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.spin += (Math.abs(b.vx) + Math.abs(b.vy)) * dt * 0.02;
      if (b.x - b.r < 32) {
        b.x = 32 + b.r;
        b.vx = Math.abs(b.vx) * 0.9;
      }
      if (b.x + b.r > 368) {
        b.x = 368 - b.r;
        b.vx = -Math.abs(b.vx) * 0.9;
      }
      if (b.y - b.r < 32) {
        b.y = 32 + b.r;
        b.vy = Math.abs(b.vy) * 0.88;
      }

      for (const bumper of this.bumpers) {
        bumper.active = Math.max(0, bumper.active - dt);
        if (this.circleBounce(bumper.x, bumper.y, 23, 150)) {
          bumper.active = 0.18;
          this.combo = Math.min(9, this.combo + 1);
          this.bestCombo = Math.max(this.bestCombo, this.combo);
          this.emit();
        }
      }
      for (const target of this.targets) {
        target.active = Math.max(0, target.active - dt);
        if (target.active <= 0 && Math.abs(b.x - target.x) < 15 && Math.abs(b.y - target.y) < 13) {
          target.active = 0.22;
          this.targetsHit++;
          this.combo = Math.min(9, this.combo + 1);
          this.bestCombo = Math.max(this.bestCombo, this.combo);
          this.addScore(100, target.x, target.y);
          this.burst(target.x, target.y, "#4DFF73");
          this.hooks.sfx("hit");
        }
      }
      for (const drop of this.drops) {
        drop.active = Math.max(0, drop.active - dt);
        if (!drop.down && Math.abs(b.x - drop.x) < 14 && Math.abs(b.y - drop.y) < 14) {
          drop.down = true;
          drop.active = 0.3;
          this.targetsHit++;
          this.addScore(125, drop.x, drop.y);
          this.burst(drop.x, drop.y, "#1AF2FF");
          this.hooks.sfx("hit");
        }
      }
      if (b.y > 82 && b.y < 112 && b.x < 180) {
        const rollover = this.rollovers.reduce((nearest, item) =>
          Math.abs(item.x - b.x) < Math.abs(nearest.x - b.x) ? item : nearest,
        );
        if (rollover.active <= 0 && Math.abs(rollover.x - b.x) < 16) {
          rollover.active = 0.55;
          this.addScore(75, rollover.x, 90);
          this.hooks.sfx("pellet");
        }
      }
      this.rampCooldown = Math.max(0, this.rampCooldown - dt);
      if (b.x > 190 && b.x < 286 && b.y > 235 && b.y < 305 && this.rampCooldown <= 0) {
        this.rampCooldown = 1.2;
        this.addScore(250, b.x, b.y);
        this.combo = Math.min(9, this.combo + 1);
        this.bestCombo = Math.max(this.bestCombo, this.combo);
        this.burst(b.x, b.y, "#1AF2FF");
        this.hooks.sfx("clear");
      }
      if (b.y > 420 && b.y < 490 && ((b.x < 125 && b.x > 42) || (b.x > 275 && b.x < 358))) {
        b.vy = -Math.abs(b.vy) - 190;
        b.vx += b.x < 200 ? 120 : -120;
        this.addScore(50, b.x, b.y);
        this.burst(b.x, b.y, "#FF5A4F");
        this.hooks.sfx("hit");
      }
      this.flipperHit(78, 548, left ? 177 : 154, left ? 510 : 535, left);
      this.flipperHit(322, 548, right ? 223 : 246, right ? 510 : 535, right);
      if (b.y > 615) {
        this.balls--;
        this.ballsUsed++;
        this.combo = 1;
        if (this.balls <= 0) {
          this.running = false;
          this.emit();
          this.hooks.gameOver(this.score);
          return;
        }
        this.ball = { x: 350, y: 520, vx: 0, vy: 0, r: 7, spin: 0 };
        this.launched = false;
        this.emit();
      }
    }
    for (const bumper of this.bumpers) bumper.active = Math.max(0, bumper.active - dt);
    for (const target of this.targets) target.active = Math.max(0, target.active - dt);
    for (const rollover of this.rollovers) rollover.active = Math.max(0, rollover.active - dt);
    for (const drop of this.drops) drop.active = Math.max(0, drop.active - dt);
    for (const particle of this.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
    }
    this.particles = this.particles.filter((particle) => particle.life > 0);
    for (const popup of this.popups) {
      popup.y -= 20 * dt;
      popup.life -= dt;
    }
    this.popups = this.popups.filter((popup) => popup.life > 0);
  }

  private metalGradient(y: number, height: number, top: string, bottom: string) {
    const gradient = this.ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, top);
    gradient.addColorStop(0.45, "#EBEBD1");
    gradient.addColorStop(0.55, bottom);
    gradient.addColorStop(1, "#232638");
    return gradient;
  }

  private drawRail(x: number, y: number, width: number, height: number) {
    const c = this.ctx;
    c.fillStyle = "#11131d";
    c.fillRect(x - 5, y - 5, width + 10, height + 10);
    c.fillStyle = this.metalGradient(y, height, "#6e7285", "#252938");
    c.fillRect(x, y, width, height);
    c.fillStyle = "#EBEBD1";
    c.globalAlpha = 0.45;
    c.fillRect(x + 2, y + 2, width - 4, 2);
    c.globalAlpha = 1;
  }

  private drawBumper(item: Light) {
    const c = this.ctx;
    c.shadowColor = item.active > 0 ? "#FFD83C" : "#FF2E94";
    c.shadowBlur = item.active > 0 ? 28 : 12;
    c.beginPath();
    c.arc(item.x, item.y, 25, 0, Math.PI * 2);
    c.fillStyle = this.metalGradient(item.y - 25, 50, "#f2f4ff", "#34384e");
    c.fill();
    c.shadowBlur = 0;
    c.beginPath();
    c.arc(item.x, item.y, 17, 0, Math.PI * 2);
    c.fillStyle = item.active > 0 ? "#FFD83C" : "#FF2E94";
    c.fill();
    c.beginPath();
    c.arc(item.x - 5, item.y - 6, 5, 0, Math.PI * 2);
    c.fillStyle = "#ffffff";
    c.globalAlpha = 0.75;
    c.fill();
    c.globalAlpha = 1;
  }

  private drawFlipper(ax: number, ay: number, bx: number, by: number, active: boolean) {
    const c = this.ctx;
    c.lineCap = "round";
    c.strokeStyle = "#151725";
    c.lineWidth = 21;
    c.beginPath();
    c.moveTo(ax, ay);
    c.lineTo(bx, by);
    c.stroke();
    c.strokeStyle = this.metalGradient(by - 10, 20, active ? "#ffffff" : "#c4c7d4", "#4a4f64");
    c.lineWidth = 15;
    c.beginPath();
    c.moveTo(ax, ay);
    c.lineTo(bx, by);
    c.stroke();
    c.lineCap = "butt";
  }

  protected render() {
    this.clear();
    const c = this.ctx;
    const table = c.createLinearGradient(0, 30, 0, 600);
    table.addColorStop(0, "#182b3b");
    table.addColorStop(0.5, "#10212b");
    table.addColorStop(1, "#071018");
    c.fillStyle = table;
    c.fillRect(22, 22, 356, 578);
    c.fillStyle = "#0b1720";
    c.fillRect(38, 38, 300, 545);
    c.fillStyle = "#112e38";
    c.beginPath();
    c.moveTo(48, 56);
    c.lineTo(328, 56);
    c.lineTo(328, 440);
    c.lineTo(288, 565);
    c.lineTo(88, 565);
    c.lineTo(48, 440);
    c.closePath();
    c.fill();
    c.strokeStyle = "#FF2E94";
    c.globalAlpha = 0.45;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(50, 58);
    c.lineTo(325, 58);
    c.lineTo(325, 430);
    c.lineTo(285, 560);
    c.moveTo(50, 58);
    c.lineTo(50, 430);
    c.lineTo(92, 560);
    c.stroke();
    c.globalAlpha = 1;
    this.drawRail(31, 29, 338, 7);
    this.drawRail(31, 29, 7, 555);
    this.drawRail(362, 29, 7, 555);
    this.drawRail(337, 80, 25, 500);

    c.fillStyle = "#223b44";
    c.beginPath();
    c.moveTo(185, 285);
    c.quadraticCurveTo(220, 230, 270, 245);
    c.lineTo(295, 300);
    c.lineTo(280, 310);
    c.quadraticCurveTo(235, 270, 198, 314);
    c.closePath();
    c.fill();
    c.strokeStyle = "#1AF2FF";
    c.lineWidth = 4;
    c.stroke();
    c.fillStyle = "#1AF2FF";
    c.globalAlpha = 0.22;
    c.fill();
    c.globalAlpha = 1;
    for (const rollover of this.rollovers) {
      c.fillStyle = rollover.active > 0 ? "#FFD83C" : "#5b6470";
      c.fillRect(rollover.x - 12, 82, 24, 10);
      c.fillStyle = "#ffffff";
      c.globalAlpha = 0.5;
      c.fillRect(rollover.x - 7, 84, 9, 2);
      c.globalAlpha = 1;
    }
    for (const bumper of this.bumpers) this.drawBumper(bumper);
    for (const target of this.targets) {
      c.fillStyle = target.active > 0 ? "#ffffff" : "#4DFF73";
      c.fillRect(target.x - 15, target.y - 6, 30, 12);
      c.fillStyle = "#183c36";
      c.fillRect(target.x - 10, target.y - 3, 20, 3);
    }
    for (const drop of this.drops)
      if (!drop.down) {
        c.fillStyle = drop.active > 0 ? "#ffffff" : "#1AF2FF";
        c.fillRect(drop.x - 13, drop.y - 11, 26, 22);
        c.fillStyle = "#24505b";
        c.fillRect(drop.x - 8, drop.y - 7, 14, 3);
      }
    c.fillStyle = "#ff4b55";
    c.beginPath();
    c.moveTo(45, 425);
    c.lineTo(120, 425);
    c.lineTo(145, 480);
    c.lineTo(58, 480);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(270, 480);
    c.lineTo(295, 425);
    c.lineTo(355, 425);
    c.lineTo(342, 480);
    c.closePath();
    c.fill();
    c.strokeStyle = "#FFD83C";
    c.lineWidth = 3;
    c.stroke();
    this.drawFlipper(
      78,
      548,
      this.keys.has("KeyA") ? 177 : 154,
      this.keys.has("KeyA") ? 510 : 535,
      this.keys.has("KeyA"),
    );
    this.drawFlipper(
      322,
      548,
      this.keys.has("KeyD") ? 223 : 246,
      this.keys.has("KeyD") ? 510 : 535,
      this.keys.has("KeyD"),
    );
    c.fillStyle = "#11131d";
    c.fillRect(42, 578, 314, 15);
    c.fillStyle = "#030507";
    c.fillRect(104, 578, 190, 15);
    c.fillStyle = "#161a24";
    c.fillRect(340, 85, 22, 495);
    c.fillStyle = "#FFD83C";
    c.font = "9px monospace";
    c.fillText("PLUNGER", 342, 105);
    c.fillStyle = "#7d8495";
    c.fillRect(346, 478, 10, 75);
    c.fillStyle = "#EBEBD1";
    c.fillRect(344, 520, 14, 7);

    const shadow = c.createRadialGradient(
      this.ball.x - 2,
      this.ball.y + 6,
      1,
      this.ball.x,
      this.ball.y + 6,
      13,
    );
    shadow.addColorStop(0, "rgba(0,0,0,.7)");
    shadow.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = shadow;
    c.beginPath();
    c.ellipse(this.ball.x, this.ball.y + 7, 14, 5, 0, 0, Math.PI * 2);
    c.fill();
    const ballGradient = c.createRadialGradient(
      this.ball.x - 3,
      this.ball.y - 4,
      1,
      this.ball.x,
      this.ball.y,
      8,
    );
    ballGradient.addColorStop(0, "#ffffff");
    ballGradient.addColorStop(0.3, "#d8e1ec");
    ballGradient.addColorStop(0.72, "#777f90");
    ballGradient.addColorStop(1, "#202532");
    c.fillStyle = ballGradient;
    c.beginPath();
    c.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#ffffff";
    c.globalAlpha = 0.8;
    c.fillRect(this.ball.x - 3, this.ball.y - 4, 2, 2);
    c.globalAlpha = 1;
    for (const particle of this.particles) this.rect(particle.x, particle.y, 3, 3, particle.color);
    for (const popup of this.popups) {
      c.globalAlpha = Math.min(1, popup.life * 2);
      this.text(popup.text, popup.x, popup.y, "#FFD83C", 11, "center");
      c.globalAlpha = 1;
    }
  }
}
