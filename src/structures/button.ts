import { GuioraButtonEventMap,GuioraButtonEvent } from "../emitter.ts";
import { GuioraButtonHandler } from "../handler/button-handler.ts";
import { GuioraButtonType } from "../types.ts";
import { GuioraColor } from "./color.ts";
import { Guiora } from "./guiora.ts";
import { GuioraRect } from "./rect.ts";

export class GuioraButton extends GuioraRect implements GuioraButtonType {
  private _text: string;

  private handler = new GuioraButtonHandler(this);

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: GuioraColor,
    text: string,
  ) { 
    super(x, y, width, height, color);
    this._text = text;
  }

  public get text(): string {
    return this._text;
  }

  public set text(text: string) {
    this._text = text;
  }

  render(lib: Guiora): void {
    lib.setDrawColor(this.color);
    lib.drawRect(this);
  }

  update(lib: Guiora): void {
    this.handler.handle(lib);
  }

  public isClicked(): boolean {
    return this.handler.isClicked;
  }

  public isHovered(): boolean {
    return this.handler.isHovering;
  }

  public onClick(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.Click]) => void): void {
    this.handler.on(GuioraButtonEvent.Click, fn);
  }

  public onLeftClick(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.LeftClick]) => void): void {
    this.handler.on(GuioraButtonEvent.LeftClick, fn);
  }

  public onMiddleClick(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.MiddleClick]) => void): void {
    this.handler.on(GuioraButtonEvent.MiddleClick, fn);
  }

  public onRightClick(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.RightClick]) => void): void {
    this.handler.on(GuioraButtonEvent.RightClick, fn);
  }

  public onRelease(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.Release]) => void): void {
    this.handler.on(GuioraButtonEvent.Release, fn);
  }

  public onHover(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.Hover]) => void): void {
    this.handler.on(GuioraButtonEvent.Hover, fn);
  }

  public onEnter(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.Enter]) => void): void {
    this.handler.on(GuioraButtonEvent.Enter, fn);
  }

  public onLeave(fn: (e: GuioraButtonEventMap[GuioraButtonEvent.Leave]) => void): void {
    this.handler.on(GuioraButtonEvent.Leave, fn);
  }
}
