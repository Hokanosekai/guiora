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

## Usage

> Note: Guiora is still in development, so the API is not fully finished.

```typescript
const lib = Deno.dlopen("./bin/libguiora.so", {
  ...,
});
```
# Author

- [**Hokanosekai**](https://github.com)

# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Acknowledgments

- [**Rust**](https://www.rust-lang.org/)
- [**SDL2**](https://www.libsdl.org/)
- [**Deno**](https://deno.land/)
