const prisma = require('../utils/prisma');

const findAll = () =>
  prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: true } } },
  });

const findById = (id) =>
  prisma.tag.findUnique({
    where: { id },
    include: { _count: { select: { posts: true } } },
  });

const create = (data) => prisma.tag.create({ data });

const update = (id, data) => prisma.tag.update({ where: { id }, data });

const remove = (id) => prisma.tag.delete({ where: { id } });

module.exports = { findAll, findById, create, update, remove };
