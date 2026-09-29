import type { EngineHooks, GameEngine } from "../arcade/types";
export abstract class CanvasEngine implements GameEngine {
  protected ctx: CanvasRenderingContext2D; protected keys=new Set<string>(); protected running=false; protected frozen=false; protected last=0; protected raf=0; protected hooks:EngineHooks;
  constructor(protected canvas:HTMLCanvasElement,hooks:EngineHooks){const c=canvas.getContext("2d");if(!c)throw new Error("Canvas unavailable");this.ctx=c;this.hooks=hooks;c.imageSmoothingEnabled=false}
  start(){this.running=true;this.last=performance.now();this.raf=requestAnimationFrame(this.loop)}
  pause(v:boolean){this.frozen=v}
  key(code:string,down:boolean){down?this.keys.add(code):this.keys.delete(code)}
  destroy(){this.running=false;cancelAnimationFrame(this.raf)}
  private loop=(t:number)=>{if(!this.running)return;const dt=Math.min(.033,(t-this.last)/1000);this.last=t;if(!this.frozen)this.update(dt);this.render();this.raf=requestAnimationFrame(this.loop)};
  protected abstract update(dt:number):void; protected abstract render():void;
  protected clear(){this.ctx.fillStyle="#07060D";this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)}
  protected text(text:string,x:number,y:number,color:string="#EBEBD1",size=12,align:CanvasTextAlign="left"){this.ctx.fillStyle=color;this.ctx.font=`${size}px monospace`;this.ctx.textAlign=align;this.ctx.fillText(text,x,y)}
  protected rect(x:number,y:number,w:number,h:number,color:string){this.ctx.fillStyle=color;this.ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
}
