import { GuioraColor, GuioraMouse, GuioraRect } from "./types.ts";

export class Guiora {
  private lib: any;

  private window: Deno.UnsafePointer;

  constructor(
    public name: string,
    public width: number,
    public height: number,
  ) {
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
      is_running: {
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

  run() {
    const rect = { x: 0, y: 0, width: 100, height: 100 } as GuioraRect;
    while (this.running) {
      console.log(this.mouse);
      this.clear();
      this.draw_rect(rect, { r: 255, g: 0, b: 125, a: 255 } as GuioraColor);
      this.update();
      this.render();

      rect.x = this.mouse.x;
      rect.y = this.mouse.y;
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
    this.lib.symbols.update(this.window);
  }

  render() {
    this.lib.symbols.render(this.window);
  }

  close() {
    this.lib.symbols.close(this.window);
  }

  get mouse(): GuioraMouse {
    return {
      x: this.lib.symbols.get_mouse_x(this.window),
      y: this.lib.symbols.get_mouse_y(this.window),
    };
  }

  get running(): boolean {
    return this.lib.symbols.is_running(this.window);
  }

  setDrawColor(color: GuioraColor) {
    this.lib.symbols.set_draw_color(this.window, color.r, color.g, color.b, color.a);
  }
}


const guiora = new Guiora("Guiora", 800, 600);
guiora.run();
