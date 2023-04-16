import { GuioraPointType } from "../types.ts";
import { GuioraColor } from "./color.ts";
import { Guiora } from "./guiora.ts";

export class GuioraPoint implements GuioraPointType {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public color: GuioraColor,
  ) { }

  render(_lib: Guiora): void {
    throw new Error("Method not implemented.");
  }

  update(_lib: Guiora): void {
    throw new Error("Method not implemented.");
  }
}