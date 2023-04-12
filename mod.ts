const lib = Deno.dlopen("./target/debug/libguiora.so", {
  create_window: { parameters: [], result: "void" }
});

lib.symbols.create_window();