const Comment = require('../models/comment.model');
const asyncHandler = require('../utils/asyncHandler');
const { notFound } = require('../utils/errors');
const { getPagination } = require('../utils/pagination');

// GET /api/comments?postId=1&page=1&limit=10
const getAll = asyncHandler(async (req, res) => {
  const { page, limit, skip, take } = getPagination(req.query);
  const where = {};
  if (req.query.postId !== undefined) where.postId = Number(req.query.postId) || -1;

  const [comments, total] = await Comment.findAll({ where, skip, take });
  res.json({ data: comments, meta: { page, limit, total } });
});

const getOne = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw notFound('Коментар');
  res.json(comment);
});

const create = asyncHandler(async (req, res) => {
  const { content, postId, authorId } = req.body;
  const comment = await Comment.create({ content: content.trim(), postId, authorId });
  res.status(201).json(comment);
});

const update = asyncHandler(async (req, res) => {
  res.json(await Comment.update(req.params.id, { content: req.body.content.trim() }));
});

const remove = asyncHandler(async (req, res) => {
  await Comment.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getOne, create, update, remove };
