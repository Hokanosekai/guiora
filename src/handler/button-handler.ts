import { Emitter, GuioraButtonEvent, GuioraButtonEventMap } from "../emitter.ts";
import { GuioraButton } from "../structures/button.ts";
import { Guiora } from "../structures/guiora.ts";
import { GuioraMouseButton, GuioraMouseEventType } from "../types.ts";

export class GuioraButtonHandler extends Emitter<GuioraButtonEventMap> {
  private _isClicked = false;
  private _hovering = false;
  private _startTime = 0;

  constructor(
    private button: GuioraButton,
  ) {
    super();
  }

  public get isClicked(): boolean {
    return this._isClicked;
  }

  public get isHovering(): boolean {
    return this._hovering;
  }

  public get startTime(): number {
    return this._startTime;
  }

  public isHovered(mouse: GuioraMouseEventType): boolean {
    return mouse.x >= this.button.x &&
      mouse.x <= this.button.x + this.button.width &&
      mouse.y >= this.button.y &&
      mouse.y <= this.button.y + this.button.height;
  }

  public isReleased(mouse: GuioraMouseEventType): boolean {
    return this.isHovered(mouse) && !this._isClicked;
  }

  public handle(lib: Guiora) {
    const mouse = lib.mouse;
    mouse.onMove((e) => {
      if (this.isHovered(e.mouse)) {
        if (!this._hovering) {
          this._hovering = true;
          this.emit(GuioraButtonEvent.Enter, { button: this.button });
        }
        this.emit(GuioraButtonEvent.Hover, { button: this.button });
      } else {
        if (this._hovering) {
          this._hovering = false;
          this.emit(GuioraButtonEvent.Leave, { button: this.button });
        }
      }
    });

    mouse.onClick((e) => {
      if (this.isHovered(e.mouse)) {
        this._isClicked = true;
        this._startTime = Date.now();
      }
    });

    mouse.onRelease((e) => {
      if (this._isClicked) {
        if (this.isHovered(e.mouse)) {
          this.emit(GuioraButtonEvent.Click, { button: this.button });

          // Long press
          if (Date.now() - this._startTime > 500) {
            this.emit(GuioraButtonEvent.LongPress, { button: this.button });
          }

          switch (e.mouse.button) {
            case GuioraMouseButton.Left:
              this.emit(GuioraButtonEvent.LeftClick, { button: this.button });
              break;
            case GuioraMouseButton.Middle:
              this.emit(GuioraButtonEvent.MiddleClick, { button: this.button });
              break;
            case GuioraMouseButton.Right:
              this.emit(GuioraButtonEvent.RightClick, { button: this.button });
              break;
          }
        }

        this._startTime = 0;
        this._isClicked = false;
      }

      if (this.isReleased(e.mouse)) {
        this.emit(GuioraButtonEvent.Release, { button: this.button });
      }
    });
  }
}