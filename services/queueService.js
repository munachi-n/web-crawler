const { EventEmitter } = require('events');

class QueueService extends EventEmitter {
  constructor(options = {}) {
    super();
    this.concurrency = options.concurrency || 3;
    this.queue = [];
    this.active = 0;
    this.completed = 0;
    this.failed = 0;
    this.processing = false;
  }

  add(task) {
    this.queue.push({
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      task,
      status: 'pending',
      addedAt: Date.now(),
    });
    this.emit('task:added', this.queue.length);
    this._process();
    return this;
  }

  addBatch(tasks) {
    tasks.forEach((t) => this.add(t));
    return this;
  }

  async _process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0 && this.active < this.concurrency) {
      const item = this.queue.shift();
      this.active++;
      item.status = 'active';

      try {
        const result = await item.task();
        this.completed++;
        this.emit('task:completed', { id: item.id, result });
      } catch (error) {
        this.failed++;
        this.emit('task:failed', { id: item.id, error: error.message });
      } finally {
        this.active--;
      }
    }

    this.processing = false;

    if (this.queue.length > 0) {
      this._process();
    } else if (this.active === 0) {
      this.emit('queue:drained');
    }
  }

  stats() {
    return {
      pending: this.queue.length,
      active: this.active,
      completed: this.completed,
      failed: this.failed,
    };
  }

  clear() {
    this.queue = [];
    this.emit('queue:cleared');
  }
}

module.exports = QueueService;
