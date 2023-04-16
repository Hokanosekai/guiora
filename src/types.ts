import { Guiora } from "./structures/guiora.ts";
import { GuioraMouse } from "./structures/mouse.ts";

export const GUIORA_UPDATE_CAP = 1 / 60;

export type GuioraElement = {
  render: (lib: Guiora) => void;
  update: (lib: Guiora, mouse: GuioraMouse) => void;
}

export type GuioraColorType = {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type GuioraRectType = {
  x: number;
  y: number;
  width: number;
  height: number;
} & GuioraElement

export type GuioraPointType = {
  x: number;
  y: number;
  width: number;
  color: GuioraColorType;
} & GuioraElement

export type GuioraTextType = {
  text: string;
  color: GuioraColorType;
  align: GuioraTextAlign;
} & GuioraElement

export enum GuioraTextAlign {
  Left = 0,
  Center = 1,
  Right = 2,
}

export type GuioraButtonType = {
  rect: GuioraRectType;
  color: GuioraColorType;
  text: string;
} & GuioraElement

export type GuioraMouseType = {
  x: number;
  y: number;
  button: number;
}

export type GuioraMouseEventType = {
  x: number;
  y: number;
  button: GuioraMouseButton;
}

export enum GuioraMouseButton {
  Left = 1,
  Right = 2,
  Middle = 3,
}

export type GuioraEventType = {
  name: string;
  fn: () => void;
}

export type GuioraRenderFn = (lib: Guiora) => void;
export type GuioraUpdateFn = (lib: Guiora, mouse: GuioraMouse) => void;