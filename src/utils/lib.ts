const LIB_NAME = "libguiora";
const LIB_EXT = Deno.build.os === "windows" 
  ? ".dll"
  : Deno.build.os === "darwin"
    ? ".dylib" 
    : ".so";
const DENO_GUIORA_PATH = Deno.env.get("DENO_GUIORA_PATH") || "./bin";
const LIB_PATH = `${DENO_GUIORA_PATH}/${LIB_NAME}${LIB_EXT}`;

export const LIB_GUIORA = Deno.dlopen(LIB_PATH, {
  new: {
    parameters: ["buffer", "u32", "u32"],
    result: "pointer",
  },
  close: {
    parameters: ["pointer"],
    result: "void",
  },
  render: {
    parameters: ["pointer"],
    result: "void",
  },
  update: {
    parameters: ["pointer"],
    result: "void",
  },
  draw_rect: {
    parameters: ["pointer","i32", "i32", "u32", "u32"],
    result: "void",
  },
  set_draw_color: {
    parameters: ["pointer", "u8", "u8", "u8", "u8"],
    result: "void",
  },
  clear: {
    parameters: ["pointer"],
    result: "void",
  },
  get_mouse: {
    parameters: [
      "pointer",
      "pointer",
      "pointer",
      "pointer"
    ],
    result: "i32",
  },
  is_running: {
    parameters: ["pointer"],
    result: "bool",
  },
});