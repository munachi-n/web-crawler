class LinkGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  addPage(url, data = {}) {
    if (!this.nodes.has(url)) {
      this.nodes.set(url, { url, inbound: 0, outbound: 0, ...data });
    }
    return this.nodes.get(url);
  }

  addLink(fromUrl, toUrl) {
    this.addPage(fromUrl);
    this.addPage(toUrl);

    this.edges.push({ from: fromUrl, to: toUrl });
    this.nodes.get(fromUrl).outbound++;
    this.nodes.get(toUrl).inbound++;
  }

  getPage(url) {
    return this.nodes.get(url) || null;
  }

  getOutboundLinks(url) {
    return this.edges.filter((e) => e.from === url).map((e) => e.to);
  }

  getInboundLinks(url) {
    return this.edges.filter((e) => e.to === url).map((e) => e.from);
  }

  getMostLinked(limit = 10) {
    return Array.from(this.nodes.values())
      .sort((a, b) => b.inbound - a.inbound)
      .slice(0, limit);
  }

  getOrphanPages() {
    return Array.from(this.nodes.values()).filter((n) => n.inbound === 0);
  }

  getStats() {
    const nodes = Array.from(this.nodes.values());
    return {
      totalPages: nodes.length,
      totalLinks: this.edges.length,
      avgInbound: nodes.length ? (this.edges.length / nodes.length).toFixed(2) : 0,
      orphanPages: nodes.filter((n) => n.inbound === 0).length,
    };
  }

  toJSON() {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
    };
  }
}

module.exports = LinkGraph;
