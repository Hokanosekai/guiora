import { GuioraButtonEvent, GuioraEvent, GuioraEventMap, GuioraGlobalEventMap, GuioraParamsMap } from "./emitter.ts";
import { Emitter } from "./emitter.ts";
import { GUIORA_UPDATE_CAP, GuioraButton, GuioraColor, GuioraMouse, GuioraMouseButton, GuioraRect, GuioraUpdateFn } from "./types.ts";

export class Guiora extends Emitter<GuioraGlobalEventMap> {
  private lib: any;

  private window: Deno.UnsafePointer;

  private _fps = 0;

  private previousMouse?: GuioraMouse;
  private currentMouse?: GuioraMouse;
  private isClicked = false;
  private lastClick = 0;

  private buttons: GuioraButton[] = [];

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
    let render = true;

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

        // Handle events
        this.handleEvent();

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

  drawRect(rect: GuioraRect, color: GuioraColor) {
    this.setDrawColor(color);
    this.lib.symbols.draw_rect(this.window, rect.x, rect.y, rect.width, rect.height);
  }

  clear() {
    this.lib.symbols.clear(this.window);
  }

  update() {
    // Update the buttons
    this.buttons.forEach((button) => {
      button.update(this, this.mouse);
    });

    // Update the window
    this.lib.symbols.update(this.window);
  }

  handleEvent() {
    // Emit events

    /**
     * MouseUpEvent
     * Emitted when the mouse is released
     */
    if (!this.isMouseDown()) {
      this.lastClick = Date.now();
      this.emit(GuioraEvent.MouseUp, { mouse: this.mouse });
    }

    /**
     * MouseMoveEvent
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
     * MouseClickEvent
     * Emitted when the mouse is clicked
     */
    if (!this.isMouseDown() && this.isClicked && Date.now() - this.lastClick < 200) {
      this.isClicked = false;
      this.emit(GuioraEvent.MouseClick, { mouse: this.currentMouse });
    }

    /**
     * MouseDownEvent
     * Emitted when the mouse is pressed
     */
    if (this.isMouseDown()) {
      this.isClicked = true;
      this.currentMouse = this.mouse;
      this.emit(GuioraEvent.MouseDown, { mouse: this.mouse });
    }
  }

  render(callback?: GuioraUpdateFn) {
    // Clear the window
    this.clear();

    // Draw the buttons
    this.buttons.forEach((button) => {
      button.draw(this);
    });

    // Draw the user
    callback?.(this, this.mouse);

    // Render the window
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

  /**
   * MouseDown
   * 
   * @event Guiora#MouseDown
   * @type {GuioraMouse}
   * @property {number} x - The x position of the mouse
   * @property {number} y - The y position of the mouse
   * @property {number} button - The button that was pressed
   * @description
   * Emitted when the mouse is pressed
   */
  public onMouseDown(callback: (mouse: GuioraMouse) => void) {
    this.on(GuioraEvent.MouseDown, (event: GuioraParamsMap[GuioraEvent.MouseDown]) => {
      callback(event.mouse);
    });
  }

  /**
   * MouseMove
   * 
   * @event Guiora#MouseMove
   * @type {GuioraMouse}
   * @property {number} x - The x position of the mouse
   * @property {number} y - The y position of the mouse
   * @property {number} button - The button that was pressed
   * @description
   * Emitted when the mouse is moved
   */
  public onMouseMove(callback: (mouse: GuioraMouse) => void) {
    this.on(GuioraEvent.MouseMove, (event: GuioraParamsMap[GuioraEvent.MouseMove]) => {
      callback(event.mouse);
    });
  }

  /**
   * MouseUp
   * 
   * @event Guiora#MouseUp
   * @type {GuioraMouse}
   * @property {number} x - The x position of the mouse
   * @property {number} y - The y position of the mouse
   * @property {number} button - The button that was pressed
   * @description
   * Emitted when the mouse is released
   */
  public onMouseUp(callback: (mouse: GuioraMouse) => void) {
    this.on(GuioraEvent.MouseUp, (event: GuioraParamsMap[GuioraEvent.MouseUp]) => {
      callback(event.mouse);
    });
  }

  /**
   * MouseClick
   * 
   * @event Guiora#MouseClick
   * @type {GuioraMouse}
   * @property {number} x - The x position of the mouse
   * @property {number} y - The y position of the mouse
   * @property {number} button - The button that was pressed
   * @description
   * Emitted when the mouse is clicked
   */
  public onMouseClick(callback: (mouse: GuioraMouse) => void) {
    this.on(GuioraEvent.MouseClick, (event: GuioraParamsMap[GuioraEvent.MouseClick]) => {
      console.log("Mouse click", event);
      callback(event.mouse);
    });
  }

  public onKeyPress(callback: (key: any) => void) {
  }

  get fps(): number {
    return this._fps;
  }

  public addButton(button: GuioraButton) {
    this.buttons.push(button);
  }
}


const guiora = new Guiora("Guiora", 800, 600);

let color = {
  r: 255,
  g: 0,
  b: 0,
  a: 255,
};

guiora.onMouseClick((mouse) => {
  /*if (mouse.isDown(GuioraMouseButton.Left)) {
    console.log("Left mouse button is down");
    color = {
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
      a: 255,
    };
  } else if (mouse.isDown(GuioraMouseButton.Right)) {
    console.log("Right mouse button is down");
  } else if (mouse.isDown(GuioraMouseButton.Middle)) {
    console.log("Middle mouse button is down");
  }*/
});

const button = new GuioraButton({
    x: 10,
    y: 10,
    width: 100,
    height: 50,
  }, 
  color, 
  "Hello World"
)

guiora.addButton(button);

button.onClicked((evt_bt) => {
  console.log(evt_bt);
  evt_bt.color = {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
    a: 255,
  };
  console.log(evt_bt);
});


guiora.run((lib, mouse) => {
  guiora.drawRect({
    x: mouse.x,
    y: mouse.y,
    width: 100,
    height: 100,
  }, color);
});

