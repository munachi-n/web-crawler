class CrawlStateManager {
  constructor() {
    this.states = new Map();
  }

  create(crawlId, config = {}) {
    const state = {
      id: crawlId,
      status: 'initialized',
      config,
      queue: [],
      visited: new Set(),
      results: [],
      errors: [],
      startTime: null,
      endTime: null,
      progress: { total: 0, completed: 0, failed: 0, remaining: 0 },
    };
    this.states.set(crawlId, state);
    return state;
  }

  get(crawlId) {
    return this.states.get(crawlId) || null;
  }

  updateStatus(crawlId, status) {
    const state = this.states.get(crawlId);
    if (!state) return null;
    state.status = status;
    if (status === 'running' && !state.startTime) state.startTime = Date.now();
    if (status === 'completed' || status === 'failed') state.endTime = Date.now();
    return state;
  }

  addToQueue(crawlId, urls) {
    const state = this.states.get(crawlId);
    if (!state) return;
    const newUrls = urls.filter((u) => !state.visited.has(u));
    state.queue.push(...newUrls);
    state.progress.total = state.visited.size + state.queue.length;
    state.progress.remaining = state.queue.length;
  }

  markVisited(crawlId, url) {
    const state = this.states.get(crawlId);
    if (!state) return;
    state.visited.add(url);
    state.queue = state.queue.filter((u) => u !== url);
    state.progress.completed = state.visited.size;
    state.progress.remaining = state.queue.length;
  }

  addResult(crawlId, result) {
    const state = this.states.get(crawlId);
    if (!state) return;
    state.results.push(result);
  }

  addError(crawlId, error) {
    const state = this.states.get(crawlId);
    if (!state) return;
    state.errors.push(error);
    state.progress.failed++;
  }

  getProgress(crawlId) {
    const state = this.states.get(crawlId);
    if (!state) return null;

    const elapsed = state.startTime ? Date.now() - state.startTime : 0;
    return {
      ...state.progress,
      elapsed,
      status: state.status,
      percentage: state.progress.total > 0
        ? ((state.progress.completed / state.progress.total) * 100).toFixed(1) + '%'
        : '0%',
    };
  }

  cleanup(crawlId) {
    this.states.delete(crawlId);
  }
}

module.exports = CrawlStateManager;
