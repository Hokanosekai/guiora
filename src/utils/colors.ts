import { GuioraColor } from "../structures/color.ts";

export class Colors {
  static readonly Black       = new GuioraColor(  0,   0,   0, 255);
  static readonly White       = new GuioraColor(255, 255, 255, 255);
  static readonly Red         = new GuioraColor(255,   0,   0, 255);
  static readonly Green       = new GuioraColor(  0, 255,   0, 255);
  static readonly Blue        = new GuioraColor(  0,   0, 255, 255);
  static readonly Yellow      = new GuioraColor(255, 255,   0, 255);
  static readonly Magenta     = new GuioraColor(255,   0, 255, 255);
  static readonly Cyan        = new GuioraColor(  0, 255, 255, 255);
  static readonly Gray        = new GuioraColor(128, 128, 128, 255);
  static readonly Silver      = new GuioraColor(192, 192, 192, 255);
  static readonly Maroon      = new GuioraColor(128,   0,   0, 255);
  static readonly Olive       = new GuioraColor(128, 128,   0, 255);
  static readonly Lime        = new GuioraColor(  0, 128,   0, 255);
  static readonly Teal        = new GuioraColor(  0, 128, 128, 255);
  static readonly Navy        = new GuioraColor(  0,   0, 128, 255);
  static readonly Purple      = new GuioraColor(128,   0, 128, 255);
  static readonly Orange      = new GuioraColor(255, 165,   0, 255);
  static readonly Transparent = new GuioraColor(  0,   0,   0, 0  );

  /**
   * Creates a GuioraColor from a hexadecimal string.
   * 
   * @param hex Hexadecimal string in the format #RRGGBBAA
   * @returns GuioraColor
   */
  static fromHex(hex: string): GuioraColor {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const a = hex.length === 9 
      ? parseInt(hex.substring(7, 9), 16) 
      : 255;
    return new GuioraColor(r, g, b, a);
  }

  /**
   * Creates a GuioraColor from red, green, and blue values.
   * 
   * @param r Red value
   * @param g Green value
   * @param b Blue value
   * @returns GuioraColor
   */
  static fromRgb(r: number, g: number, b: number): GuioraColor {
    return new GuioraColor(r, g, b, 255);
  }

  /**
   * Creates a GuioraColor from red, green, blue, and alpha values.
   * 
   * @param r Red value
   * @param g Green value
   * @param b Blue value
   * @param a Alpha value
   * @returns GuioraColor
   */
  static fromRgba(r: number, g: number, b: number, a: number): GuioraColor {
    return new GuioraColor(r, g, b, a);
  }

  /**
   * Creates a GuioraColor from hue, saturation, and lightness values.
   * 
   * @param h Hue value
   * @param s Saturation value
   * @param l Lightness value
   * @returns GuioraColor
   */
  static fromHsl(h: number, s: number, l: number): GuioraColor {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }
    return new GuioraColor(
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
      255,
    );
  }
}