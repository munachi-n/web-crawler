const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.76',
];

class UserAgentRotator {
  constructor(agents) {
    this.agents = agents || USER_AGENTS;
    this.index = 0;
  }

  next() {
    const agent = this.agents[this.index];
    this.index = (this.index + 1) % this.agents.length;
    return agent;
  }

  random() {
    return this.agents[Math.floor(Math.random() * this.agents.length)];
  }

  getAll() {
    return [...this.agents];
  }

  addAgent(agent) {
    this.agents.push(agent);
  }
}

module.exports = { UserAgentRotator, USER_AGENTS };
