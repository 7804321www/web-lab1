const prisma = require('../utils/prisma');

const include = { author: { select: { id: true, username: true } } };

const findAll = ({ where, skip, take }) =>
  Promise.all([
    prisma.comment.findMany({ where, include, skip, take, orderBy: { createdAt: 'asc' } }),
    prisma.comment.count({ where }),
  ]);

const findById = (id) => prisma.comment.findUnique({ where: { id }, include });

const create = (data) => prisma.comment.create({ data, include });

const update = (id, data) => prisma.comment.update({ where: { id }, data, include });

const remove = (id) => prisma.comment.delete({ where: { id } });

module.exports = { findAll, findById, create, update, remove };
