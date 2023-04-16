import { GuioraButton } from "./structures/button.ts";
import { GuioraMouseEventType } from "./types.ts";

export enum GuioraGlobalEvent {
  Quit = "quit",
}

export enum GuioraKeyboardEvent {
  Press   = "keyboard-press",
  Release = "keyboard-release",
}

export enum GuioraMouseEvent {
  Press       = "mouse-press",
  Release     = "mouse-release",
  Move        = "mouse-move",
  Drag        = "mouse-drag",
  Click       = "mouse-click",
  LeftClick   = "mouse-left-click",
  RightClick  = "mouse-right-click",
  MiddleClick = "mouse-middle-click",
  Wheel       = "mouse-wheel",
}

export enum GuioraButtonEvent {
  Click       = "button-click",
  LeftClick   = "button-left-click",
  RightClick  = "button-right-click",
  MiddleClick = "button-middle-click",
  Hover       = "button-hover",
  Leave       = "button-leave",
  Enter       = "button-enter",
  Release     = "button-release",
  LongPress   = "button-long-press",
}

export type GuioraEvent = 
  GuioraGlobalEvent   |
  GuioraMouseEvent    |
  GuioraKeyboardEvent |
  GuioraButtonEvent;

export type GuioraGlobalEventMap   = {
  [GuioraGlobalEvent.Quit]:         GuioraQuitEventParams;
}
export type GuioraButtonEventMap   = {
  [GuioraButtonEvent.Click]:        GuioraButtonEventParams;
  [GuioraButtonEvent.LeftClick]:    GuioraButtonEventParams;
  [GuioraButtonEvent.RightClick]:   GuioraButtonEventParams;
  [GuioraButtonEvent.MiddleClick]:  GuioraButtonEventParams;
  [GuioraButtonEvent.Hover]:        GuioraButtonEventParams;
  [GuioraButtonEvent.Leave]:        GuioraButtonEventParams;
  [GuioraButtonEvent.Enter]:        GuioraButtonEventParams;
  [GuioraButtonEvent.Release]:      GuioraButtonEventParams;
  [GuioraButtonEvent.LongPress]:    GuioraButtonEventParams;
}
export type GuioraMouseEventMap    = {
  [GuioraMouseEvent.Press]:         GuioraMouseDefaultEventParams;
  [GuioraMouseEvent.Release]:       GuioraMouseDefaultEventParams;
  [GuioraMouseEvent.Move]:          GuioraMouseDefaultEventParams;
  [GuioraMouseEvent.Click]:         GuioraMouseDefaultEventParams;
  [GuioraMouseEvent.Drag]:          GuioraMouseDragEventParams;
  [GuioraMouseEvent.LeftClick]:     GuioraMouseDefaultEventParams;
  [GuioraMouseEvent.RightClick]:    GuioraMouseDefaultEventParams;
  [GuioraMouseEvent.MiddleClick]:   GuioraMouseDefaultEventParams;
  [GuioraMouseEvent.Wheel]:         GuioraMouseDefaultEventParams;
}
export type GuioraKeyboardEventMap = {
  [GuioraKeyboardEvent.Press]:      GuioraKeyboardEventParams;
  [GuioraKeyboardEvent.Release]:    GuioraKeyboardEventParams;
}

export type GuioraEventMap = 
  GuioraGlobalEventMap   |
  GuioraButtonEventMap   |
  GuioraMouseEventMap    |
  GuioraKeyboardEventMap;

export type GuioraEventKey<T extends GuioraEventMap> = string & keyof T;
export type GuioraEventReciever<T> = (params: T) => void;

interface GuioraMouseDefaultEventParams {
  mouse: GuioraMouseEventType;
}

interface GuioraMouseDragEventParams extends GuioraMouseDefaultEventParams {
  start: [number, number];
  end: [number, number];
  delta: [number, number];
  distance: number;
  start_time: number;
  end_time: number;
  duration: number;
}

// deno-lint-ignore no-empty-interface
interface GuioraQuitEventParams {}

interface GuioraKeyboardEventParams {
  key: string;
}

interface GuioraButtonEventParams {
  button: GuioraButton;
}

export class Emitter<T extends GuioraEventMap> {
  private events: {[K in keyof T]?: GuioraEventReciever<T[K]>[]} = {};
  private eventLimits: {[eventName: string]: number} = {};

  protected on<K extends GuioraEventKey<T>>(
    eventName: K,
    callback: GuioraEventReciever<T[K]>,
    limit = Infinity
  ): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    const callbacks = this.events[eventName]!;
    const count = callbacks.filter(cb => cb === callback).length;
    if (count >= limit) {
      throw new Error(`Callback for event '${eventName}' has already reached its limit of ${limit}`);
    }
    callbacks.push(callback);
    this.eventLimits[eventName] = limit;
  }

  protected emit<K extends GuioraEventKey<T> >(eventName: K, params: T[K]): void {
    const callbacks = this.events[eventName];
    if (callbacks) {
      callbacks.forEach(callback => {
        callback(params);
      });
      if (callbacks.length >= this.eventLimits[eventName]) {
        delete this.events[eventName];
        delete this.eventLimits[eventName];
      }
    }
  }
}