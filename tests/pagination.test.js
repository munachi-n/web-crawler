const Pagination = require('../utils/pagination');

describe('Pagination', () => {
  const items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

  describe('paginate', () => {
    test('returns first page with default limit', () => {
      const result = Pagination.paginate(items, { page: 1 });
      expect(result.data).toHaveLength(20);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.totalItems).toBe(50);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(false);
    });

    test('returns correct second page', () => {
      const result = Pagination.paginate(items, { page: 2, limit: 10 });
      expect(result.data).toHaveLength(10);
      expect(result.data[0].id).toBe(11);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(true);
    });

    test('returns last page correctly', () => {
      const result = Pagination.paginate(items, { page: 3 });
      expect(result.data).toHaveLength(10);
      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.hasPrev).toBe(true);
    });

    test('handles empty array', () => {
      const result = Pagination.paginate([], { page: 1 });
      expect(result.data).toHaveLength(0);
      expect(result.pagination.totalPages).toBe(0);
    });
  });

  describe('sortItems', () => {
    test('sorts ascending', () => {
      const data = [{ v: 3 }, { v: 1 }, { v: 2 }];
      const sorted = Pagination.sortItems(data, 'v', 'asc');
      expect(sorted.map((d) => d.v)).toEqual([1, 2, 3]);
    });

    test('sorts descending by default', () => {
      const data = [{ v: 1 }, { v: 3 }, { v: 2 }];
      const sorted = Pagination.sortItems(data, 'v');
      expect(sorted.map((d) => d.v)).toEqual([3, 2, 1]);
    });
  });
});
