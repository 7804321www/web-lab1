const Post = require('../models/post.model');
const asyncHandler = require('../utils/asyncHandler');
const { notFound, AppError } = require('../utils/errors');
const { getPagination } = require('../utils/pagination');

// GET /api/posts?published=true&categoryId=1&authorId=2&tag=node&search=express&page=1&limit=10
const getAll = asyncHandler(async (req, res) => {
  const { page, limit, skip, take } = getPagination(req.query);
  const { published, categoryId, authorId, tag, search } = req.query;

  const where = {};
  if (published !== undefined) {
    if (!['true', 'false'].includes(published)) {
      throw new AppError(400, 'Параметр "published" має бути true або false');
    }
    where.published = published === 'true';
  }
  if (categoryId !== undefined) where.categoryId = Number(categoryId) || -1;
  if (authorId !== undefined) where.authorId = Number(authorId) || -1;
  if (tag) where.tags = { some: { name: tag } };
  if (search) where.title = { contains: search, mode: 'insensitive' };

  const [posts, total] = await Post.findAll({ where, skip, take });
  res.json({ data: posts, meta: { page, limit, total } });
});

const getOne = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw notFound('Статтю');
  res.json(post);
});

const create = asyncHandler(async (req, res) => {
  const { title, content, published, authorId, categoryId, tags } = req.body;
  const post = await Post.create({
    title: title.trim(),
    content,
    authorId,
    ...(published !== undefined ? { published } : {}),
    ...(categoryId !== undefined ? { categoryId } : {}),
    ...(tags ? { tags } : {}),
  });
  res.status(201).json(post);
});

const update = asyncHandler(async (req, res) => {
  const { title, content, published, categoryId, tags } = req.body;
  const data = {};
  if (title !== undefined) data.title = title.trim();
  if (content !== undefined) data.content = content;
  if (published !== undefined) data.published = published;
  if (categoryId !== undefined) data.categoryId = categoryId;
  if (tags !== undefined) data.tags = tags;

  res.json(await Post.update(req.params.id, data));
});

const remove = asyncHandler(async (req, res) => {
  await Post.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getOne, create, update, remove };
