import { GuioraColorType, GuioraTextAlign, GuioraTextType } from '../types.ts';
import { GuioraElement } from './element.ts';
import { Guiora } from "./guiora.ts";

export class GuioraText extends GuioraElement implements GuioraTextType {
  private _text: string;
  private _align: GuioraTextAlign;
  
  constructor(
    x: number,
    y: number,
    text: string,
    color: GuioraColorType,
    align: GuioraTextAlign,
  ) {
    super(x, y, color);
    this._text = text;
    this._align = align;
  }

  public get text(): string {
    return this._text;
  }

  public set text(text: string) {
    this._text = text;
  }

  public get align(): GuioraTextAlign {
    return this._align;
  }

  public set align(align: GuioraTextAlign) {
    this._align = align;
  }

  render(_lib: Guiora): void {
    throw new Error("Method not implemented.");
  }

  update(_lib: Guiora): void {
    throw new Error("Method not implemented.");
  }
}