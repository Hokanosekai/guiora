import { GuioraColorType } from "../types.ts";

export class GuioraColor implements GuioraColorType {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number,
  ) {}
}