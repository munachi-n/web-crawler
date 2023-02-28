class Scheduler {
  constructor() {
    this.jobs = new Map();
    this.timers = new Map();
  }

  schedule(name, fn, intervalMs) {
    if (this.jobs.has(name)) {
      this.cancel(name);
    }

    this.jobs.set(name, {
      fn,
      interval: intervalMs,
      lastRun: null,
      runCount: 0,
      active: true,
    });

    const timer = setInterval(async () => {
      const job = this.jobs.get(name);
      if (!job || !job.active) return;

      try {
        job.lastRun = new Date().toISOString();
        job.runCount++;
        await fn();
      } catch (error) {
        console.error(`Scheduler [${name}] error:`, error.message);
      }
    }, intervalMs);

    this.timers.set(name, timer);
    return this;
  }

  scheduleOnce(name, fn, delayMs) {
    const timer = setTimeout(async () => {
      try {
        await fn();
      } catch (error) {
        console.error(`Scheduler [${name}] error:`, error.message);
      } finally {
        this.jobs.delete(name);
        this.timers.delete(name);
      }
    }, delayMs);

    this.jobs.set(name, { fn, delay: delayMs, type: 'once', active: true });
    this.timers.set(name, timer);
    return this;
  }

  cancel(name) {
    const timer = this.timers.get(name);
    if (timer) {
      clearInterval(timer);
      clearTimeout(timer);
    }
    this.timers.delete(name);
    this.jobs.delete(name);
  }

  cancelAll() {
    for (const name of this.jobs.keys()) {
      this.cancel(name);
    }
  }

  listJobs() {
    const list = [];
    for (const [name, job] of this.jobs) {
      list.push({ name, ...job, fn: undefined });
    }
    return list;
  }
}

module.exports = Scheduler;
