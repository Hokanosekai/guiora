import { GuioraColorType, GuioraTextAlign, GuioraTextType } from '../types.ts';
import { Guiora } from "./guiora.ts";

export class GuioraText implements GuioraTextType {
  constructor(
    public text: string,
    public color: GuioraColorType,
    public align: GuioraTextAlign,
  ) { }

  render(_lib: Guiora): void {
    throw new Error("Method not implemented.");
  }

  update(_lib: Guiora): void {
    throw new Error("Method not implemented.");
  }
}