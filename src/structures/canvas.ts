import { GuioraElement } from "../types.ts";
import { Guiora } from "./guiora.ts";

export class GuioraCanvas {
  private _elements: GuioraElement[] = [];

  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public get elements(): GuioraElement[] {
    return this._elements;
  }

  public push(...element: GuioraElement[]): void {
    this._elements.push(...element);
  }

  public pop(): GuioraElement | undefined {
    return this._elements.pop();
  }

  public shift(): GuioraElement | undefined {
    return this._elements.shift();
  }

  public unshift(element: GuioraElement): void {
    this._elements.unshift(element);
  }

  public remove(element: GuioraElement): void {
    const index = this._elements.indexOf(element);
    if (index !== -1) {
      this._elements.splice(index, 1);
    }
  }

  public clear(): void {
    this._elements = [];
  }

  public render(lib: Guiora): void {
    for (const element of this._elements) {
      element.render(lib);
    }
  }

  public update(lib: Guiora): void {
    for (const element of this._elements) {
      element.update(lib, lib.mouse);
    }
  }
}