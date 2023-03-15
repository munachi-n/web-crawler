const { EventEmitter } = require('events');

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
    this.history = [];
    this.maxHistory = 100;
  }

  publish(event, data) {
    const entry = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    this.history.push(entry);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.emit(event, data);
    this.emit('*', entry);
  }

  subscribe(event, handler) {
    this.on(event, handler);
    return () => this.off(event, handler);
  }

  subscribeOnce(event, handler) {
    this.once(event, handler);
  }

  getHistory(event) {
    if (event) {
      return this.history.filter((e) => e.event === event);
    }
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
  }
}

// Singleton
const bus = new EventBus();
module.exports = bus;
