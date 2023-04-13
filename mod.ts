/**
    * Create a new window
    *
    * @param title The title of the window
    * @param width The width of the window
    * @param height The height of the window
    * @return A pointer to the window

    #[no_mangle]
    pub extern "C" fn window_create(title: *const u8, width: u32, height: u32) -> *mut sdl2::video::Window {
 */

const lib = Deno.dlopen("./bin/libguiora.so", {
  window_create: {
    parameters: ["buffer", "u32", "u32"],
    result: "pointer",
  },
  window_destroy: {
    parameters: ["pointer"],
    result: "void",
  },
  window_render: {
    parameters: ["pointer"],
    result: "void",
  },
  window_update: {
    parameters: ["pointer"],
    result: "void",
  },
  window_draw_rect: {
    parameters: ["pointer", "u32", "u32", "u32", "u32"],
    result: "void",
  },
  window_clear: {
    parameters: ["pointer"],
    result: "void",
  },
});

const t = new TextEncoder().encode("Hello World");
const w = lib.symbols.window_create(t, 800, 600);

lib.symbols.window_draw_rect(w, 50, 50, 100, 100);
lib.symbols.window_render(w);

while (true) {
  lib.symbols.window_update(w);
}

