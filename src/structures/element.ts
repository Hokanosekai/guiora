import { GuioraElementType } from "../types.ts";
import { Guiora, GuioraColor } from "./index.ts";

export abstract class GuioraElement implements GuioraElementType {
  protected _x: number;
  protected _y: number;
  protected _color: GuioraColor;
  protected _visible = true;

  constructor(x: number, y: number, color: GuioraColor) {
    this._x = x;
    this._y = y;
    this._color = color;
  }

  public get x(): number {
    return this._x;
  }

  public set x(x: number) {
    this._x = x;
  }

  public get y(): number {
    return this._y;
  }

  public set y(y: number) {
    this._y = y;
  }

  public get color(): GuioraColor {
    return this._color;
  }

  public set color(color: GuioraColor) {
    this._color = color;
  }

  public get visible(): boolean {
    return this._visible;
  }

  public set visible(visible: boolean) {
    this._visible = visible;
  }

  public abstract render(lib: Guiora): void;
  public abstract update(lib: Guiora): void;
}