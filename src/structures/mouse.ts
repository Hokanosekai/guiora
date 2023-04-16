import { Emitter, GuioraMouseEvent, GuioraMouseEventMap } from "../emitter.ts";
import { GuioraMouseType,GuioraMouseButton } from "../types.ts";
import { Guiora } from "./guiora.ts";

export class GuioraMouse extends Emitter<GuioraMouseEventMap> implements GuioraMouseType {
  private isClicked = false;
  private isDragged = false;

  private dragStart: [number, number] = [0, 0];
  private dragEnd: [number, number] = [0, 0];
  private dragDelta: [number, number] = [0, 0];
  private dragDistance = 0;
  private dragStartTime = 0;
  private dragEndTime = 0;
  private dragDuration = 0;

  constructor(
    private _x: number,
    private _y: number,
    private _button: number,
  ) { 
    super();
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get button(): number {
    return this._button;
  }

  public get position(): [number, number] {
    return [this.x, this.y];
  }

  public isPressed(): boolean {
    return this.button !== 0;
  }

  public isReleased(): boolean {
    return this.button === 0;
  }

  public isButtonPressed(button: GuioraMouseButton): boolean {
    return (this.button & button) === button;
  }

  public isButtonReleased(button: GuioraMouseButton): boolean {
    return !this.isButtonPressed(button);
  }

  public isLeftPressed(): boolean {
    return this.isButtonPressed(GuioraMouseButton.Left);
  }

  public isRightPressed(): boolean {
    return this.isButtonPressed(GuioraMouseButton.Right);
  }

  public isMiddlePressed(): boolean {
    return this.isButtonPressed(GuioraMouseButton.Middle);
  }

  public update(lib: Guiora): void {
    const { x, y, button } = lib.getMouse();

    if (this.x !== x || this.y !== y) {
      this.emit(GuioraMouseEvent.Move, {
          mouse: {
            x,
            y,
            button
          }
        });
      if (button !== 0 && !this.isDragged) {
        this.isDragged = true;
        this.dragStart = [x, y];
        this.dragStartTime = Date.now();
      }
    }

    if (this.button !== button) {
      if (button !== 0) {
        this.isClicked = true;
        this.emit(GuioraMouseEvent.Press, {
          mouse: {
            x,
            y,
            button
          }
        });
      } else {
        if (this.isClicked && !this.isDragged) {
          this.emit(GuioraMouseEvent.Click, {
            mouse: {
              x: this.x,
              y: this.y,
              button: this.button
            }
          });

          switch (this.button) {
            case GuioraMouseButton.Left:
              this.emit(GuioraMouseEvent.LeftClick, {
                mouse: {
                  x: this.x,
                  y: this.y,
                  button: this.button
                }
              });
              break;
            case GuioraMouseButton.Right:
              this.emit(GuioraMouseEvent.RightClick, {
                mouse: {
                  x: this.x,
                  y: this.y,
                  button: this.button
                }
              });
              break;
            case GuioraMouseButton.Middle:
              this.emit(GuioraMouseEvent.MiddleClick, {
                mouse: {
                  x: this.x,
                  y: this.y,
                  button: this.button
                }
              });
              break;
          }
        }

        if (this.isDragged) {
          this.dragEnd = [x, y];
          this.dragDelta = [this.dragEnd[0] - this.dragStart[0], this.dragEnd[1] - this.dragStart[1]];
          this.dragDistance = Math.sqrt(this.dragDelta[0] ** 2 + this.dragDelta[1] ** 2);

          if (this.dragDistance < 10) {
            this.isDragged = false;
            return;
          }

          this.dragEndTime = Date.now();
          this.dragDuration = this.dragEndTime - this.dragStartTime;
          this.emit(GuioraMouseEvent.Drag, { 
            mouse: {
              x: this.x,
              y: this.y,
              button: this.button
            },
            start: this.dragStart,
            end: this.dragEnd,
            delta: this.dragDelta,
            distance: this.dragDistance,
            start_time: this.dragStartTime,
            end_time: this.dragEndTime,
            duration: this.dragDuration,
           });
        }

        this.isClicked = false;
        this.isDragged = false;
        this.emit(GuioraMouseEvent.Release, {
          mouse: {
            x,
            y,
            button: button as GuioraMouseButton
          }
        });
      }
    }

    this._x = x;
    this._y = y;
    this._button = button;
  }

  public onClick(fn: (e: GuioraMouseEventMap[GuioraMouseEvent.Click]) => void): void {
    this.on(GuioraMouseEvent.Click, (e) => fn(e));
  }

  public onPress(fn: (e: GuioraMouseEventMap[GuioraMouseEvent.Press]) => void): void {
    this.on(GuioraMouseEvent.Press, (e) => fn(e));
  }

  public onRelease(fn: (e: GuioraMouseEventMap[GuioraMouseEvent.Release]) => void): void {
    this.on(GuioraMouseEvent.Release, (e) => fn(e));
  }

  public onMove(fn: (e: GuioraMouseEventMap[GuioraMouseEvent.Move]) => void): void {
    this.on(GuioraMouseEvent.Move, (e) => fn(e));
  }

  public onDrag(fn: (e: GuioraMouseEventMap[GuioraMouseEvent.Drag]) => void): void {
    this.on(GuioraMouseEvent.Drag, (e) => fn(e));
  }

  public onLeftClick(fn: (e: GuioraMouseEventMap[GuioraMouseEvent.LeftClick]) => void): void {
    this.on(GuioraMouseEvent.LeftClick, (e) => fn(e));
  }

  public onRightClick(fn: (e: GuioraMouseEventMap[GuioraMouseEvent.RightClick]) => void): void {
    this.on(GuioraMouseEvent.RightClick, (e) => fn(e));
  }

  public onMiddleClick(fn: (e: GuioraMouseEventMap[GuioraMouseEvent.MiddleClick]) => void): void {
    this.on(GuioraMouseEvent.MiddleClick, (e) => fn(e));
  }
}