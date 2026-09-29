import type { ArcadeSettings, SfxName } from "./types";
export class ArcadeAudio {
  private ctx: AudioContext | undefined; private music: OscillatorNode | undefined; private gain: GainNode | undefined; private settings: ArcadeSettings;
  constructor(settings: ArcadeSettings) { this.settings = settings; }
  setSettings(v: ArcadeSettings) { this.settings = v; if (this.gain) this.gain.gain.value = v.muted ? 0 : v.music / 900; }
  unlock() { if (!this.ctx) this.ctx = new AudioContext(); if (this.ctx.state === "suspended") void this.ctx.resume(); }
  startMusic() { this.unlock(); if (!this.ctx || this.music) return; const o=this.ctx.createOscillator(), g=this.ctx.createGain(); o.type="square"; o.frequency.value=55; g.gain.value=this.settings.muted?0:this.settings.music/900; o.connect(g).connect(this.ctx.destination); o.start(); this.music=o; this.gain=g; }
  stopMusic() { this.music?.stop(); this.music=undefined; this.gain=undefined; }
  play(name:SfxName) { if(this.settings.muted||this.settings.sfx===0)return; this.unlock(); if(!this.ctx)return; const map:Record<SfxName,[number,number]>={move:[180,.04],select:[440,.08],coin:[880,.18],hit:[240,.06],shoot:[720,.05],pellet:[980,.035],explode:[90,.22],clear:[660,.25],over:[110,.5],high:[1040,.4]}; const [f,d]=map[name],o=this.ctx.createOscillator(),g=this.ctx.createGain(); o.type=name==="explode"?"sawtooth":"square"; o.frequency.setValueAtTime(f,this.ctx.currentTime); o.frequency.exponentialRampToValueAtTime(Math.max(40,f/2),this.ctx.currentTime+d); g.gain.setValueAtTime(this.settings.sfx/700,this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+d); o.connect(g).connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+d); }
}
