document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('crawlForm');
  const resultsSection = document.getElementById('results');
  const statsDiv = document.getElementById('stats');
  const resultsList = document.getElementById('results-list');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Crawling...';
    resultsSection.style.display = 'block';
    resultsList.innerHTML = '<div class="spinner">Crawling in progress...</div>';
    statsDiv.innerHTML = '';

    const payload = {
      url: document.getElementById('url').value,
      maxDepth: parseInt(document.getElementById('maxDepth').value) || 2,
      maxPages: parseInt(document.getElementById('maxPages').value) || 50,
    };

    try {
      const response = await fetch('/api/crawler/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Crawl failed');
      }

      renderStats(data.data.stats);
      renderResults(data.data.results);
    } catch (error) {
      resultsList.innerHTML = `<div class="result-card error-card"><h3>Error</h3><p>${error.message}</p></div>`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Start Crawl';
    }
  });

  function renderStats(stats) {
    statsDiv.innerHTML = `
      <div class="stats-bar">
        <div class="stat"><div class="number">${stats.pagesVisited}</div><div class="label">Pages Visited</div></div>
        <div class="stat"><div class="number">${stats.resultsCollected}</div><div class="label">Results</div></div>
        <div class="stat"><div class="number">${stats.errors}</div><div class="label">Errors</div></div>
      </div>`;
  }

  function renderResults(results) {
    if (!results.length) {
      resultsList.innerHTML = '<p>No results found.</p>';
      return;
    }
    resultsList.innerHTML = results.map((r) => {
      if (r.error) {
        return `<div class="result-card error-card"><h3>Error</h3><div class="url">${r.url}</div><p>${r.error}</p></div>`;
      }
      return `<div class="result-card">
        <h3>${r.title || 'Untitled'}</h3>
        <div class="url">${r.url}</div>
        <div class="meta"><span>Links: ${r.linkCount}</span><span>Images: ${r.imageCount}</span></div>
      </div>`;
    }).join('');
  }
});
