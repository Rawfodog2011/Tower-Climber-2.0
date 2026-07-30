/**
 * Background-safe timer manager using an inline Web Worker.
 * Web Workers run on a separate OS thread and are NOT throttled by browser tab background rules,
 * ensuring combat loop ticks and auto-farm timers run reliably even when the tab loses focus.
 */

const createWorkerScript = () => {
  const code = `
    const activeTimers = {};

    self.onmessage = function(e) {
      const { action, id, interval } = e.data;
      if (action === 'start') {
        if (activeTimers[id]) {
          clearInterval(activeTimers[id]);
        }
        let lastTime = Date.now();
        activeTimers[id] = setInterval(() => {
          const now = Date.now();
          const delta = now - lastTime;
          lastTime = now;
          self.postMessage({ type: 'tick', id, now, delta });
        }, interval || 100);
      } else if (action === 'stop') {
        if (activeTimers[id]) {
          clearInterval(activeTimers[id]);
          delete activeTimers[id];
        }
      } else if (action === 'stopAll') {
        Object.keys(activeTimers).forEach(id => {
          clearInterval(activeTimers[id]);
        });
        for (let key in activeTimers) delete activeTimers[key];
      }
    };
  `;
  const blob = new Blob([code], { type: 'application/javascript' });
  return URL.createObjectURL(blob);
};

class BackgroundTimerService {
  private worker: Worker | null = null;
  private callbacks: Map<string, (now: number, delta: number) => void> = new Map();

  private initWorker() {
    if (this.worker) return;
    try {
      const workerUrl = createWorkerScript();
      this.worker = new Worker(workerUrl);
      this.worker.onmessage = (e) => {
        const { type, id, now, delta } = e.data;
        if (type === 'tick') {
          const cb = this.callbacks.get(id);
          if (cb) cb(now, delta);
        }
      };
    } catch (err) {
      console.warn('Web Worker background timer fallback to window timer:', err);
    }
  }

  public startTimer(id: string, interval: number, callback: (now: number, delta: number) => void) {
    this.initWorker();
    this.callbacks.set(id, callback);

    if (this.worker) {
      this.worker.postMessage({ action: 'start', id, interval });
    }
  }

  public stopTimer(id: string) {
    this.callbacks.delete(id);
    if (this.worker) {
      this.worker.postMessage({ action: 'stop', id });
    }
  }

  public stopAll() {
    this.callbacks.clear();
    if (this.worker) {
      this.worker.postMessage({ action: 'stopAll' });
    }
  }
}

export const backgroundTimer = new BackgroundTimerService();
