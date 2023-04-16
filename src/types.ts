import { Guiora } from "./structures/guiora.ts";
import { GuioraMouse } from "./structures/mouse.ts";

export const GUIORA_UPDATE_CAP = 1 / 60;

export type GuioraElementType = {
  x: number;
  y: number;
  color: GuioraColorType;
  visible: boolean;
  render: (lib: Guiora) => void;
  update: (lib: Guiora) => void;
}

export type GuioraColorType = {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type GuioraRectType = {
  width: number;
  height: number;
}

export type GuioraPointType = {
  radius: number;
}

export type GuioraTextType = {
  text: string;
  align: GuioraTextAlign;
}

export enum GuioraTextAlign {
  Left = 0,
  Center = 1,
  Right = 2,
}

export type GuioraButtonType = {
  text: string;
} & GuioraRectType;

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