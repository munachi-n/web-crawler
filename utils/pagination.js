class Pagination {
  static paginate(items, options = {}) {
    const page = Math.max(1, parseInt(options.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 20));
    const offset = (page - 1) * limit;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit);
    const data = items.slice(offset, offset + limit);

    return {
      data,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static paginateQuery(query) {
    return {
      page: Math.max(1, parseInt(query.page) || 1),
      limit: Math.min(100, Math.max(1, parseInt(query.limit) || 20)),
      sortBy: query.sortBy || 'timestamp',
      sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
    };
  }

  static sortItems(items, sortBy, sortOrder = 'desc') {
    return [...items].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

module.exports = Pagination;
