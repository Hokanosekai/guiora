import { GuioraMouse } from "./types.ts";

export enum GuioraEvent {
  MouseDown = "MouseDown",
  MouseUp = "MouseUp",
  MouseMove = "MouseMove",
  MouseWheel = "MouseWheel",
  KeyDown = "KeyDown",
  KeyUp = "KeyUp",
  Quit = "Quit",
}

export type GuioraEventMap = Record<GuioraEvent, any>;
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

export type GuioraParamsMap = {
  [GuioraEvent.MouseDown]: GuioraMouseEventParams;
  [GuioraEvent.MouseUp]: GuioraMouseEventParams;
  [GuioraEvent.MouseMove]: GuioraMouseEventParams;
  [GuioraEvent.MouseWheel]: GuioraMouseEventParams;
  [GuioraEvent.KeyDown]: GuioraKeyDownEventParams;
  [GuioraEvent.KeyUp]: GuioraKeyUpEventParams;
  [GuioraEvent.Quit]: GuioraQuitEventParams;
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