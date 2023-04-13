import { GuioraEvent, GuioraEventMap, GuioraParamsMap } from "./emitter.ts";
import { Emitter } from "./emitter.ts";
import { GuioraColor, GuioraMouse, GuioraMouseButton, GuioraRect, GuioraUpdateFn } from "./types.ts";

export class Guiora extends Emitter<GuioraEventMap> {
addEventListener(arg0: any,arg1: (e: any) => void) {
throw new Error("Method not implemented.");
}
  private lib: any;

  private window: Deno.UnsafePointer;

  private previousMouse?: GuioraMouse;
  private isClicked = false;

  constructor(
    public name: string,
    public width: number,
    public height: number,
  ) {
    super();
    this.lib = Deno.dlopen("./bin/libguiora.so", {
      new: {
        parameters: ["buffer", "u32", "u32"],
        result: "pointer",
      },
      close: {
        parameters: ["pointer"],
        result: "void",
      },
      render: {
        parameters: ["pointer"],
        result: "void",
      },
      update: {
        parameters: ["pointer"],
        result: "void",
      },
      draw_rect: {
        parameters: ["pointer","i32", "i32", "u32", "u32"],
        result: "void",
      },
      set_draw_color: {
        parameters: ["pointer", "u8", "u8", "u8", "u8"],
        result: "void",
      },
      clear: {
        parameters: ["pointer"],
        result: "void",
      },
      get_mouse_x: {
        parameters: ["pointer"],
        result: "i32",
      },
      get_mouse_y: {
        parameters: ["pointer"],
        result: "i32",
      },
      get_mouse_state: {
        parameters: ["pointer"],
        result: "i32",
      },
      is_running: {
        parameters: ["pointer"],
        result: "bool",
      },
      is_mouse_down: {
        parameters: ["pointer"],
        result: "bool",
      },
    }); 
    this.window = this.lib.symbols
      .new(
        new TextEncoder().encode(this.name),
        this.width, 
        this.height
      );
  }

  run(callback?: GuioraUpdateFn) {
    while (this.running) {
      this.clear();

      callback?.(this, this.mouse);

      this.update();
      this.render();
    }
  }

  draw_rect(rect: GuioraRect, color: GuioraColor) {
    this.setDrawColor(color);
    this.lib.symbols.draw_rect(this.window, rect.x, rect.y, rect.width, rect.height);
  }

  clear() {
    this.lib.symbols.clear(this.window);
  }

  update() {
    // Emit events

    /**
     * MouseMove
     * 
     * @event Guiora#MouseMove
     * @type {GuioraMouse}
     * @property {number} x - The x position of the mouse
     * @property {number} y - The y position of the mouse
     * @description
     * Emitted when the mouse is moved
     */
    if (
      this.mouse.x !== this.previousMouse?.x || 
      this.mouse.y !== this.previousMouse?.y
    ) {
      this.emit(GuioraEvent.MouseMove, this.mouse)
      this.previousMouse = this.mouse;
    }

    /**
     * MouseDown
     * 
     * @event Guiora#MouseDown
     * @type {GuioraMouse}
     * @property {number} x - The x position of the mouse
     * @property {number} y - The y position of the mouse
     * @description
     * Emitted when the mouse is pressed
     */
    if (this.isMouseDown() && !this.isClicked) {
      this.isClicked = true;
      this.emit(GuioraEvent.MouseDown, { mouse: this.mouse });
    }

    // Update the window
    this.lib.symbols.update(this.window);

  }

  render() {
    this.lib.symbols.render(this.window);
  }

  close() {
    this.lib.symbols.close(this.window);
  }

  get mouse(): GuioraMouse {
    return new GuioraMouse(
      this.lib.symbols.get_mouse_x(this.window),
      this.lib.symbols.get_mouse_y(this.window),
      this.lib.symbols.get_mouse_state(this.window),
    );
  }

  get running(): boolean {
    return this.lib.symbols.is_running(this.window);
  }

  setDrawColor(color: GuioraColor) {
    this.lib.symbols.set_draw_color(this.window, color.r, color.g, color.b, color.a);
  }

  private isMouseDown(): boolean {
    return this.lib.symbols.is_mouse_down(this.window);
  }

  public onMouseDown(callback: (mouse: GuioraMouse) => void) {
    this.on(GuioraEvent.MouseDown, (event: GuioraParamsMap[GuioraEvent.MouseDown]) => {
      callback(event.mouse);
      this.isClicked = false;
    });
  }
}


const guiora = new Guiora("Guiora", 800, 600);

guiora.onMouseDown((mouse) => {
  if (mouse.isDown(GuioraMouseButton.Left)) {
    console.log("Left mouse button is down");
  } else if (mouse.isDown(GuioraMouseButton.Right)) {
    console.log("Right mouse button is down");
  } else if (mouse.isDown(GuioraMouseButton.Middle)) {
    console.log("Middle mouse button is down");
  }
});

guiora.run((lib, mouse) => {
});

