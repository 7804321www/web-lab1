const prisma = require('../utils/prisma');

const include = {
  author: { select: { id: true, username: true } },
  category: true,
  tags: true,
  _count: { select: { comments: true } },
};

// Перетворення масиву назв тегів у конструкцію Prisma (створити, якщо тегу ще немає)
const toTagConnect = (names) =>
  [...new Set(names.map((n) => n.trim()))].map((name) => ({
    where: { name },
    create: { name },
  }));

const findAll = ({ where, skip, take }) =>
  Promise.all([
    prisma.post.findMany({ where, include, skip, take, orderBy: { createdAt: 'desc' } }),
    prisma.post.count({ where }),
  ]);

const findById = (id) => prisma.post.findUnique({ where: { id }, include });

const create = ({ tags, ...data }) =>
  prisma.post.create({
    data: {
      ...data,
      ...(tags ? { tags: { connectOrCreate: toTagConnect(tags) } } : {}),
    },
    include,
  });

const update = async (id, { tags, ...data }) => {
  // Спочатку очищаємо старі теги, потім підключаємо нові — у межах однієї транзакції
  if (tags) {
    const [, post] = await prisma.$transaction([
      prisma.post.update({ where: { id }, data: { tags: { set: [] } } }),
      prisma.post.update({
        where: { id },
        data: { ...data, tags: { connectOrCreate: toTagConnect(tags) } },
        include,
      }),
    ]);
    return post;
  }
  return prisma.post.update({ where: { id }, data, include });
};

const remove = (id) => prisma.post.delete({ where: { id } });

module.exports = { findAll, findById, create, update, remove };
