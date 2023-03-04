class ReportGenerator {
  generate(job) {
    return {
      summary: this.buildSummary(job),
      urlBreakdown: this.buildUrlBreakdown(job.results || []),
      errorReport: this.buildErrorReport(job.results || []),
      timings: this.buildTimings(job),
    };
  }

  buildSummary(job) {
    const results = job.results || [];
    const successful = results.filter((r) => !r.error);
    const failed = results.filter((r) => r.error);

    return {
      jobId: job.id,
      targetUrl: job.url,
      status: job.status,
      totalPages: results.length,
      successfulPages: successful.length,
      failedPages: failed.length,
      successRate: results.length ? ((successful.length / results.length) * 100).toFixed(1) + '%' : '0%',
      totalLinks: successful.reduce((sum, r) => sum + (r.linkCount || 0), 0),
      totalImages: successful.reduce((sum, r) => sum + (r.imageCount || 0), 0),
    };
  }

  buildUrlBreakdown(results) {
    const domains = {};
    results.forEach((r) => {
      try {
        const domain = new URL(r.url).hostname;
        domains[domain] = (domains[domain] || 0) + 1;
      } catch (e) { /* skip */ }
    });

    return Object.entries(domains)
      .sort((a, b) => b[1] - a[1])
      .map(([domain, count]) => ({ domain, count }));
  }

  buildErrorReport(results) {
    return results
      .filter((r) => r.error)
      .map((r) => ({ url: r.url, error: r.error, timestamp: r.timestamp }));
  }

  buildTimings(job) {
    return {
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      duration: job.completedAt && job.startedAt
        ? new Date(job.completedAt) - new Date(job.startedAt)
        : null,
    };
  }
}

module.exports = ReportGenerator;
