import { GuioraPointType } from "../types.ts";
import { GuioraColor } from "./color.ts";
import { GuioraElement } from "./element.ts";
import { Guiora } from "./guiora.ts";

export class GuioraPoint extends GuioraElement implements GuioraPointType {
  private _radius: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    color: GuioraColor,
  ) {
    super(x, y, color);
    this._radius = radius;
  }

  public get radius(): number {
    return this._radius;
  }

  public set radius(radius: number) {
    this._radius = radius;
  }

  render(_lib: Guiora): void {
    throw new Error("Method not implemented.");
  }

  update(_lib: Guiora): void {
    throw new Error("Method not implemented.");
  }
}