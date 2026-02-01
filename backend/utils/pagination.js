// Pagination helper
export const paginate = (data, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);
  
  return {
    data: paginatedData,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
      hasNext: offset + limit < data.length,
      hasPrev: page > 1
    }
  };
};

// Filter helper
export const applyFilters = (data, filters) => {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      if (key === 'search') {
        return Object.values(item).some(val => 
          String(val).toLowerCase().includes(value.toLowerCase())
        );
      }
      
      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }
      
      return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
    });
  });
};

// Sort helper
export const applySorting = (data, sortBy, sortOrder = 'asc') => {
  if (!sortBy) return data;
  
  return [...data].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (sortOrder === 'desc') {
      return aVal < bVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};