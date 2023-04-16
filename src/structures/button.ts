import { Emitter,GuioraButtonEventMap,GuioraButtonEvent } from "../emitter.ts";
import { GuioraButtonType, GuioraMouseButton, GuioraMouseEventType } from "../types.ts";
import { GuioraColor } from "./color.ts";
import { Guiora } from "./guiora.ts";
import { GuioraRect } from "./rect.ts";

export class GuioraButton extends Emitter<GuioraButtonEventMap> implements GuioraButtonType {
  private isClicked = false;
  private hovering = false;
  private startTime = 0;

  constructor(
    public rect: GuioraRect,
    public color: GuioraColor,
    public text: string,
  ) { 
    super();
  }

  render(lib: Guiora): void {
    lib.setDrawColor(this.color);
    lib.drawRect(this.rect);
  }

  update(lib: Guiora): void {
    const mouse = lib.mouse;
    mouse.onMove((e) => {
      if (this.isHovered(e.mouse)) {
        if (!this.hovering) {
          this.hovering = true;
          this.emit(GuioraButtonEvent.Enter, { button: this });
        }
        this.emit(GuioraButtonEvent.Hover, { button: this });
      } else {
        if (this.hovering) {
          this.hovering = false;
          this.emit(GuioraButtonEvent.Leave, { button: this });
        }
      }
    });

    mouse.onClick((e) => {
      if (this.isHovered(e.mouse)) {
        this.isClicked = true;
        this.startTime = Date.now();
      }
    });

    mouse.onRelease((e) => {
      if (this.isClicked) {
        if (this.isHovered(e.mouse)) {
          this.emit(GuioraButtonEvent.Click, { button: this });

          // Long press
          if (Date.now() - this.startTime > 500) {
            this.emit(GuioraButtonEvent.LongPress, { button: this });
          }

          switch (e.mouse.button) {
            case GuioraMouseButton.Left:
              this.emit(GuioraButtonEvent.LeftClick, { button: this });
              break;
            case GuioraMouseButton.Middle:
              this.emit(GuioraButtonEvent.MiddleClick, { button: this });
              break;
            case GuioraMouseButton.Right:
              this.emit(GuioraButtonEvent.RightClick, { button: this });
              break;
          }
        }

        this.startTime = 0;
        this.isClicked = false;
      }

      if (this.isReleased(e.mouse)) {
        this.emit(GuioraButtonEvent.Release, { button: this });
      }
    });
  }

  public isHovered(mouse: GuioraMouseEventType): boolean {
    if (!mouse) return false;
    return mouse.x >= this.rect.x && mouse.x <= this.rect.x + this.rect.width
      && mouse.y >= this.rect.y && mouse.y <= this.rect.y + this.rect.height;
  }

  public isReleased(mouse: GuioraMouseEventType): boolean {
    return this.isHovered(mouse) && !this.isClicked;
  }

  public onClick(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.Click]) => void): void {
    this.on(GuioraButtonEvent.Click, fn);
  }

  public onLeftClick(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.LeftClick]) => void): void {
    this.on(GuioraButtonEvent.LeftClick, fn);
  }

  public onMiddleClick(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.MiddleClick]) => void): void {
    this.on(GuioraButtonEvent.MiddleClick, fn);
  }

  public onRightClick(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.RightClick]) => void): void {
    this.on(GuioraButtonEvent.RightClick, fn);
  }

  public onRelease(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.Release]) => void): void {
    this.on(GuioraButtonEvent.Release, fn);
  }

  public onHover(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.Hover]) => void): void {
    this.on(GuioraButtonEvent.Hover, fn);
  }

  public onEnter(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.Enter]) => void): void {
    this.on(GuioraButtonEvent.Enter, fn);
  }

  public onLeave(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.Leave]) => void): void {
    this.on(GuioraButtonEvent.Leave, fn);
  }
}
