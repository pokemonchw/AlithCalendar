export class Event<T = void> {
  private listeners: Set<(arg: T) => void> | null = null;
  private onceListeners: Array<(arg: T) => void> | null = null;

  private isEmitting: boolean = false;
  private queue: Array<() => void> = [];

  public on(listener: (arg: T) => void) {
    if (this.isEmitting) {
      this.queue.push(() => {
        this.on(listener);
      });
      return listener;
    }
    if (this.listeners === null) {
      this.listeners = new Set();
    }
    this.listeners.add(listener);
    return listener;
  }
  public off(listener: (arg: T) => void) {
    if (this.isEmitting) {
      this.queue.push(() => {
        this.off(listener);
      });
      return;
    }
    if (this.listeners === null) {
      return;
    }
    this.listeners.delete(listener);
  }
  public once(onceListener: (arg: T) => void) {
    if (this.isEmitting) {
      this.queue.push(() => {
        this.once(onceListener);
      });
      return onceListener;
    }
    if (this.onceListeners === null) {
      this.onceListeners = [];
    }
    this.onceListeners.push(onceListener);
    return onceListener;
  }
  public expect(filter?: (arg: T) => boolean): Promise<T> {
    if (this.isEmitting) {
      return new Promise(resolve => {
        this.queue.push(() => {
          this.expect(filter).then(resolve);
        });
      });
    }
    if (filter === undefined) {
      return new Promise(resolve => this.once(resolve));
    }
    return new Promise(resolve => {
      const listener = this.on(arg => {
        if (!filter(arg)) {
          return;
        }
        this.off(listener);
        resolve(arg);
      });
    });
  }
  public emit(arg: T) {
    if (this.isEmitting) {
      this.queue.push(() => {
        this.emit(arg);
      });
      return;
    }
    this.isEmitting = true;
    if (this.listeners !== null) {
      this.listeners.forEach(listener => listener(arg));
    }
    if (this.onceListeners !== null) {
      this.onceListeners.forEach(onceListener => onceListener(arg));
      this.onceListeners.length = 0;
    }
    this.isEmitting = false;
    while (this.queue.length >= 1) {
      this.queue.shift()!();
    }
  }
}
