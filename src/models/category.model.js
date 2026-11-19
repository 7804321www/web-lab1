const prisma = require('../utils/prisma');

const findAll = () =>
  prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: true } } },
  });

const findById = (id) =>
  prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { posts: true } } },
  });

const create = (data) => prisma.category.create({ data });

const update = (id, data) => prisma.category.update({ where: { id }, data });

const remove = (id) => prisma.category.delete({ where: { id } });

module.exports = { findAll, findById, create, update, remove };
