import { GuioraUpdateFn,GUIORA_UPDATE_CAP, GuioraMouseType } from "../types.ts";
import { LIB_GUIORA } from "../utils/lib.ts";
import { GuioraCanvas } from "./canvas.ts";
import { GuioraColor } from "./color.ts";
import { GuioraMouse } from "./mouse.ts";
import { GuioraRect } from "./rect.ts";

export class Guiora {
  static lib = LIB_GUIORA;

  private _canvas: GuioraCanvas
  private _mouse = new GuioraMouse(0, 0, 0);

  private window: Deno.PointerValue;

  private _fps = 0;

  constructor(
    public name: string,
    public width: number,
    public height: number,
  ) {
    this.window = Guiora.lib.symbols
      .new(
        new TextEncoder().encode(this.name),
        this.width, 
        this.height
      );
    this._canvas = new GuioraCanvas(this.width, this.height);
  }

  get mouse(): GuioraMouse {
    return this._mouse;
  }

  get canvas(): GuioraCanvas {
    return this._canvas;
  }

  run(callback?: GuioraUpdateFn) {
    const render = true;

    let firstTime = 0;
    let lastTime = Date.now() / 1000;
    let passedTime = 0;
    let unprocessedTime = 0;

    let frameTime = 0;
    let frames = 0;

    while (this.running) {

      firstTime = Date.now() / 1000;
      passedTime = firstTime - lastTime;
      lastTime = firstTime;

      unprocessedTime += passedTime;
      frameTime += passedTime;

      while (unprocessedTime >= GUIORA_UPDATE_CAP) {
        unprocessedTime -= GUIORA_UPDATE_CAP;

        // Update
        this.update();

        if (frameTime >= 1) {
          frameTime = 0;
          this._fps = frames;
          frames = 0;
        }
      }

      if (render) {
        // Render
        frames++;
        this.render(callback);
      } else {
        setTimeout(() => {}, 1000 / 60);
      }
    }
  }

  clear() {
    Guiora.lib.symbols.clear(this.window);
  }

  update() {
    // Update the window
    Guiora.lib.symbols.update(this.window);

    // Update the canvas
    this.canvas.update(this);

    // Update the mouse
    this.mouse.update(this);

  }

  render(callback?: GuioraUpdateFn) {
    // Clear the window
    this.clear();

    // Draw the canvas
    this.canvas.render(this);

    // Draw the user
    callback?.(this, this.mouse);

    // Render the window
    Guiora.lib.symbols.render(this.window);
  }

  close() {
    Guiora.lib.symbols.close(this.window);
  }

  getMouse(): GuioraMouseType {
    const x           = new Uint32Array(1);
    const y           = new Uint32Array(1);
    const button      = new Uint32Array(1);

    const ret = Guiora.lib.symbols.get_mouse(
      this.window,
      Deno.UnsafePointer.of(x),
      Deno.UnsafePointer.of(y),
      Deno.UnsafePointer.of(button),
    );

    if (ret !== 0) {
      throw new Error("Failed to get mouse");
    }

    return {
      x: x[0],
      y: y[0],
      button: button[0],
    };
  }

  get running(): boolean {
    return Guiora.lib.symbols.is_running(this.window);
  }

  setDrawColor(color: GuioraColor) {
    Guiora.lib.symbols.set_draw_color(this.window, color.r, color.g, color.b, color.a);
  }

  drawRect(rect: GuioraRect) {
    Guiora.lib.symbols.draw_rect(this.window, rect.x, rect.y, rect.width, rect.height);
  }

  get fps(): number {
    return this._fps;
  }
}
