import { Emitter, GuioraButtonEvent, GuioraButtonEventMap, GuioraEventKey, GuioraParamsMap } from "./emitter.ts";
import { Guiora } from "./mod.ts";

export const GUIORA_UPDATE_CAP = 1 / 60;

export type GuioraColor = {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type GuioraRect = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class GuioraMouse {
  constructor(
    public x: number,
    public y: number,
    public state: number,
  ) { }

  public isDown(button: GuioraMouseButton): boolean {
    return (this.state & button) === button;
  }

  public isUp(button: GuioraMouseButton): boolean {
    return !this.isDown(button);
  }
}

export class GuioraButton extends Emitter<GuioraButtonEventMap> {
  constructor(
    public rect: GuioraRect,
    public color: GuioraColor,
    public text: string,
  ) {
    super();
  }

  public draw(lib: Guiora): void {
    lib.drawRect(this.rect, this.color);
  }

  public isHovered(mouse: GuioraMouse): boolean {
    return mouse.x >= this.rect.x && mouse.x <= this.rect.x + this.rect.width
      && mouse.y >= this.rect.y && mouse.y <= this.rect.y + this.rect.height;
  }

  public isClicked(mouse: GuioraMouse): boolean {
    return this.isHovered(mouse) && mouse.isDown(GuioraMouseButton.Left);
  }

  public isReleased(mouse: GuioraMouse): boolean {
    return this.isHovered(mouse) && mouse.isUp(GuioraMouseButton.Left);
  }

  public update(lib: Guiora, mouse: GuioraMouse): void {
    if (this.isClicked(mouse)) {
      this.emit(GuioraButtonEvent.Click, { button: this });
    }
  }

  public onClicked(fn: (button: GuioraButton) => void): void {
    this.on(GuioraButtonEvent.Click, (event: GuioraParamsMap[GuioraButtonEvent.Click]) => {
      fn(event.button);
    });
  }
}

export enum GuioraMouseButton {
  Left = 1,
  Right = 2,
  Middle = 4,
}

export type GuioraUpdateFn = (lib: Guiora, mouse: GuioraMouse) => void;