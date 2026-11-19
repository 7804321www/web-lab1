const Tag = require('../models/tag.model');
const asyncHandler = require('../utils/asyncHandler');
const { notFound } = require('../utils/errors');

const getAll = asyncHandler(async (req, res) => {
  res.json(await Tag.findAll());
});

const getOne = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.id);
  if (!tag) throw notFound('Тег');
  res.json(tag);
});

const create = asyncHandler(async (req, res) => {
  const tag = await Tag.create({ name: req.body.name.trim() });
  res.status(201).json(tag);
});

const update = asyncHandler(async (req, res) => {
  res.json(await Tag.update(req.params.id, { name: req.body.name.trim() }));
});

const remove = asyncHandler(async (req, res) => {
  await Tag.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getOne, create, update, remove };
