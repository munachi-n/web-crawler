class Throttle {
  constructor(ratePerSecond = 5) {
    this.ratePerSecond = ratePerSecond;
    this.interval = 1000 / ratePerSecond;
    this.lastCall = 0;
    this.queue = [];
    this.processing = false;
  }

  async execute(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this._process();
    });
  }

  async _process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const elapsed = now - this.lastCall;

      if (elapsed < this.interval) {
        await this._sleep(this.interval - elapsed);
      }

      const { fn, resolve, reject } = this.queue.shift();
      this.lastCall = Date.now();

      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }

  _sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  setRate(ratePerSecond) {
    this.ratePerSecond = ratePerSecond;
    this.interval = 1000 / ratePerSecond;
  }

  pending() {
    return this.queue.length;
  }

  clear() {
    this.queue.forEach(({ reject }) => reject(new Error('Throttle cleared')));
    this.queue = [];
  }
}

module.exports = Throttle;
