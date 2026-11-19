const prisma = require('../utils/prisma');

// passwordHash ніколи не повертається клієнту
const publicSelect = {
  id: true,
  email: true,
  username: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const findAll = ({ skip, take }) =>
  Promise.all([
    prisma.user.findMany({ select: publicSelect, skip, take, orderBy: { id: 'asc' } }),
    prisma.user.count(),
  ]);

const findById = (id) =>
  prisma.user.findUnique({
    where: { id },
    select: { ...publicSelect, _count: { select: { posts: true, comments: true } } },
  });

const create = (data) => prisma.user.create({ data, select: publicSelect });

const update = (id, data) => prisma.user.update({ where: { id }, data, select: publicSelect });

const remove = (id) => prisma.user.delete({ where: { id }, select: publicSelect });

module.exports = { findAll, findById, create, update, remove };
