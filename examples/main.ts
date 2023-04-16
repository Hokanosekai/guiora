import { Colors, Guiora, GuioraButton, GuioraRect } from "../mod.ts";

const guiora = new Guiora("Guiora", 800, 600);

let color = Colors.Teal;

const rect = new GuioraRect(400, 400, 100, 100, Colors.Red);
const button = new GuioraButton(
  100, 100, 100, 100,
  color, 
  "Hello World"
)
guiora.canvas.push(button, rect);

button.onClick((e) => {
  console.log("Button Clicked");
})

button.onEnter((e) => {
  button.width = 200;
  button.height = 200;
})

button.onLeave((e) => {
  button.width = 100;
  button.height = 100;
})

guiora.mouse.onPress((evt_mouse) => {
  console.log("Mouse Pressed");
});

guiora.mouse.onRelease((evt_mouse) => {
  console.log("Mouse Released");
});

guiora.mouse.onMove((evt_mouse) => {
  rect.x = evt_mouse.mouse.x;
  rect.y = evt_mouse.mouse.y
});

guiora.mouse.onDrag((evt_mouse) => {
  console.log(evt_mouse);
  button.x = evt_mouse.end[0];
  button.y = evt_mouse.end[1];
});

guiora.mouse.onClick((evt_mouse) => {
  console.log("Mouse Clicked");
});

guiora.mouse.onRightClick((evt_mouse) => {
  console.log("Mouse Right Clicked");
});

guiora.mouse.onLeftClick((evt_mouse) => {
  console.log("Mouse Left Clicked");
});

guiora.mouse.onMiddleClick((evt_mouse) => {
  console.log("Mouse Middle Clicked");
});

guiora.run((lib, mouse) => {
});
