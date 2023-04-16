import { GuioraRectType } from "../types.ts";
import { Guiora } from "./guiora.ts";

export class GuioraRect implements GuioraRectType {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) { }

  public get right(): number {
    return this.x + this.width;
  }

  public get bottom(): number {
    return this.y + this.height;
  }

  render(lib: Guiora): void {
    lib.drawRect(this);
  }

  update(_lib: Guiora): void {

  }
}