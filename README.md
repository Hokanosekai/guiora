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
