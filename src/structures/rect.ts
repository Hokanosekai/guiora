import { GuioraRectType } from "../types.ts";
import { GuioraElement } from "./element.ts";
import { Guiora } from "./guiora.ts";
import { GuioraColor } from "./index.ts";

export class GuioraRect extends GuioraElement implements GuioraRectType {
  private _width: number;
  private _height: number;
  
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: GuioraColor,
  ) {
    super(x, y, color);
    this._width = width;
    this._height = height;
  }
  
  public get width(): number {
    return this._width;
  }

  public set width(width: number) {
    this._width = width;
  }

  public get height(): number {
    return this._height;
  }

  public set height(height: number) {
    this._height = height;
  }

  render(lib: Guiora): void {
    lib.drawRect(this);
  }

  update(_lib: Guiora): void {

  }
}