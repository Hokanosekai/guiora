import { GuioraButton, GuioraMouse } from "./types.ts";

export enum GuioraEvent {
  MouseDown = "MouseDown",
  MouseUp = "MouseUp",
  MouseMove = "MouseMove",
  MouseClick = "MouseClick",
  MouseWheel = "MouseWheel",
  KeyDown = "KeyDown",
  KeyUp = "KeyUp",
  Quit = "Quit",
}

export type GuioraGlobalEventMap = Record<GuioraEvent, any>;

export enum GuioraButtonEvent {
  Click = "Click",
  Hover = "Hover",
  Release = "Release",
}

export type GuioraButtonEventMap = Record<GuioraButtonEvent, any>;

export type GuioraEventMap = GuioraGlobalEventMap | GuioraButtonEventMap;

export type GuioraEventKey<T extends GuioraEventMap> = string & keyof T;
export type GuioraEventReciever<T> = (params: T) => void;

interface GuioraMouseEventParams {
  mouse: GuioraMouse;
}

interface GuioraKeyDownEventParams {
  key: string;
}

interface GuioraKeyUpEventParams {
  key: string;
}

interface GuioraQuitEventParams {}

interface GuioraButtonEventParams {
  button: GuioraButton;
}

export type GuioraParamsMap = {
  [GuioraEvent.MouseDown]: GuioraMouseEventParams;
  [GuioraEvent.MouseUp]: GuioraMouseEventParams;
  [GuioraEvent.MouseClick]: GuioraMouseEventParams;
  [GuioraEvent.MouseMove]: GuioraMouseEventParams;
  [GuioraEvent.MouseWheel]: GuioraMouseEventParams;
  [GuioraEvent.KeyDown]: GuioraKeyDownEventParams;
  [GuioraEvent.KeyUp]: GuioraKeyUpEventParams;
  [GuioraEvent.Quit]: GuioraQuitEventParams;
  [GuioraButtonEvent.Click]: GuioraButtonEventParams;
  [GuioraButtonEvent.Hover]: GuioraButtonEventParams;
  [GuioraButtonEvent.Release]: GuioraButtonEventParams;
};



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