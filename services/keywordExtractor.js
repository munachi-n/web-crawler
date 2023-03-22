class KeywordExtractor {
  constructor(options = {}) {
    this.minWordLength = options.minWordLength || 3;
    this.maxKeywords = options.maxKeywords || 20;
    this.stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
      'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
      'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
      'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
      'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
      'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
      'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
      'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
      'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
      'give', 'day', 'most', 'are', 'was', 'is', 'has', 'had', 'been',
    ]);
  }

  extract(text) {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= this.minWordLength && !this.stopWords.has(w));

    const freq = {};
    words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.maxKeywords)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / words.length) * 100).toFixed(2) + '%',
      }));
  }

  extractPhrases(text, phraseLength = 2) {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    const phrases = {};

    for (let i = 0; i <= words.length - phraseLength; i++) {
      const phrase = words.slice(i, i + phraseLength).join(' ');
      const hasStopOnly = phrase.split(' ').every((w) => this.stopWords.has(w));
      if (!hasStopOnly) {
        phrases[phrase] = (phrases[phrase] || 0) + 1;
      }
    }

    return Object.entries(phrases)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.maxKeywords)
      .map(([phrase, count]) => ({ phrase, count }));
  }
}

module.exports = KeywordExtractor;
