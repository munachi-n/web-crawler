const CacheService = require('../services/cacheService');

describe('CacheService', () => {
  let cache;

  beforeEach(() => {
    cache = new CacheService({ ttl: 1000, maxSize: 5 });
  });

  test('stores and retrieves values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  test('returns null for missing keys', () => {
    expect(cache.get('nonexistent')).toBeNull();
  });

  test('has() returns true for existing keys', () => {
    cache.set('key1', 'value1');
    expect(cache.has('key1')).toBe(true);
  });

  test('has() returns false for missing keys', () => {
    expect(cache.has('nonexistent')).toBe(false);
  });

  test('deletes keys', () => {
    cache.set('key1', 'value1');
    cache.delete('key1');
    expect(cache.get('key1')).toBeNull();
  });

  test('clears all entries', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.size()).toBe(0);
  });

  test('evicts oldest when max size reached', () => {
    for (let i = 0; i < 6; i++) {
      cache.set(`key${i}`, `val${i}`);
    }
    expect(cache.size()).toBe(5);
  });

  test('returns expired entries as null', async () => {
    cache = new CacheService({ ttl: 50 });
    cache.set('temp', 'value');
    await new Promise((r) => setTimeout(r, 100));
    expect(cache.get('temp')).toBeNull();
  });

  test('reports stats', () => {
    cache.set('a', 1);
    cache.get('a');
    cache.get('a');
    const stats = cache.stats();
    expect(stats.size).toBe(1);
    expect(stats.totalHits).toBe(2);
  });
});
