// Розбір параметрів ?page=1&limit=10 із безпечними значеннями за замовчуванням
const getPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit, take: limit };
};

module.exports = { getPagination };
