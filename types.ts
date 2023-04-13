import { Guiora } from "./mod.ts";

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

export enum GuioraMouseButton {
  Left = 1,
  Right = 2,
  Middle = 4,
}

export type GuioraUpdateFn = (lib: Guiora, mouse: GuioraMouse) => void;