# Guiora

Guiora is a simple GUI library for [Deno](https://deno.land/). It is working with SDL2 and Rust.

## Installation

Start by cloning the repository:

```bash
git clone
```

Then, you need to compile the Rust code:

```bash
cd guiora
make all --lib=1 --release=1
```
> Note: This will create a `target` folder and a `bin` folder where the compiled lib file will be as `libguiora.so`.

## Usage

> Note: Guiora is still in development, so the API is not fully finished.

```typescript
const guiora = new Guiora("Guiora", 800, 600);
guiora.run();
```
This will create a window with the title "Guiora" and a size of 800x600. In the window, you will see a red square that will move along your mouse.

You can modify the `run()` function in the `Guiora` class to create your own objects.

Then you can run your code with:

```bash
deno run -A --unstable mod.ts
```

## Examples

### Mouse

The mouse struct is the following:

```typescript
class GuioraMouse {
    x: number;
    y: number;
    state: number;
}
```

You can access the mouse directly from the `Guiora` instance you created:

```typescript
const guiora = new Guiora("Guiora", 800, 600);

const mouse = guiora.mouse;
```

There is prebuilt functions to know if a button is pressed or not:

| Function | Description |
| --- | --- |
| `isLeftPressed()` | Returns true if the left button is pressed. |
| `isMiddlePressed()` | Returns true if the middle button is pressed. |
| `isRightPressed()` | Returns true if the right button is pressed. |
| `isPressed()` | Returns true if a button is pressed. |
| `isButtonPressed(button: number)` | Returns true if the button is pressed. |
| `isReleased()` | Returns true if buttons is not pressed. |

You can listen to mouse events with the following code:

```typescript
guiora.mouse.onClick((e) => {
  ...
});

guiora.mouse.onPress((e) => {
  ...
}

guiora.mouse.onRelease((e) => {
  ...
});

guiora.mouse.onMove((e) => {
  ...
});

guiora.mouse.onDrag((e) => {
  ...
});

guiora.mouse.onLeftClick((e) => {
  ...
});

guiora.mouse.onRightClick((e) => {
  ...
});

guiora.mouse.onMiddleClick((e) => {
  ...
});
```

### Color

Guiora has a built-in color struct:

```typescript
class GuioraColor {
    r: number;
    g: number;
    b: number;
    a: number;
}
```

You can creata custom color with the following code:

```typescript
const color = new GuioraColor(255, 0, 0, 255);
// or
const color = Colors.fromHex("#ff0000"); // #rrggbb or #rrggbbaa
```

Also, there is a built-in color palette you can access it with the `Colors` object:

| Color | Value |
| --- | --- |
| `Colors.Black` | `new GuioraColor(0, 0, 0, 255)` |
| `Colors.White` | `new GuioraColor(255, 255, 255, 255)` |
| `Colors.Red` | `new GuioraColor(255, 0, 0, 255)` |
| `Colors.Green` | `new GuioraColor(0, 255, 0, 255)` |
| `Colors.Blue` | `new GuioraColor(0, 0, 255, 255)` |
| `Colors.Yellow` | `new GuioraColor(255, 255, 0, 255)` |
| `Colors.Magenta` | `new GuioraColor(255, 0, 255, 255)` |
| `Colors.Cyan` | `new GuioraColor(0, 255, 255, 255)` |
| `Colors.Gray` | `new GuioraColor(128, 128, 128, 255)` |
| `Colors.Silver` | `new GuioraColor(192, 192, 192, 255)` |
| `Colors.Maroon` | `new GuioraColor(128, 0, 0, 255)` |
| `Colors.Olive` | `new GuioraColor(128, 128, 0, 255)` |
| `Colors.Lime` | `new GuioraColor(0, 128, 0, 255)` |
| `Colors.Teal` | `new GuioraColor(0, 128, 128, 255)` |
| `Colors.Navy` | `new GuioraColor(0, 0, 128, 255)` |
| `Colors.Purple` | `new GuioraColor(128, 0, 128, 255)` |
| `Colors.Orange` | `new GuioraColor(255, 165, 0, 255)` |
| `Colors.Transparent` | `new GuioraColor(0, 0, 0, 0)` |

The Colors object has also some prebuilt functions:

| Function | Description |
| --- | --- |
| `fromHex(hex: string)` | Returns a color from a hex string. |
| `fromRgb(r: number, g: number, b: number)` | Returns a color from RGB values. |
| `fromRgba(r: number, g: number, b: number, a: number)` | Returns a color from RGBA values. |
| `fromHsl(h: number, s: number, l: number)` | Returns a color from HSL values. |

### Canvas

### Rectangle

A rectangle is defined by the following struct:

```typescript
class GuioraRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
```

```typescript
const rect = new GuioraRect(0, 0, 100, 50);
```



### Button

A button is defined by the following struct:

```typescript
class GuioraButton {
    rect: GuioraRect;
    text: string;
    color: GuioraColor;
}
```

```typescript	
const button = new GuioraButton({
  rect: new GuioraRect(0, 0, 100, 50),
  text: "Button",
  color: Colors.Red,
});
```

Like the mouse, there is prebuilt functions to know if a button is pressed or not:

| Function | Description |
| --- | --- |
| `isHovered(mouse: GuioraMouse)` | Returns true if the button is hovered. |
| `isReleased(mouse: GuioraMouse)` | Returns true if the button is released. |

You can listen to button events with the following code:

```typescript
button.onClick((e) => {
  ...
});

button.onLeftClick((e) => {
  ...
});

button.onMiddleClick((e) => {
  ...
});

button.onRightClick((e) => {
  ...
});

button.onRelease((e) => {
  ...
});

button.onHover((e) => {
  ...
});

button.onEnter((e) => {
  ...
});

button.onLeave((e) => {
  ...
});
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

# Author

- [**Hokanosekai**](https://github.com)

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Acknowledgments

- [**Rust**](https://www.rust-lang.org/)
- [**SDL2**](https://www.libsdl.org/)
- [**Deno**](https://deno.land/)
