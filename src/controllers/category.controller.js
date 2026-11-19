const Category = require('../models/category.model');
const asyncHandler = require('../utils/asyncHandler');
const { notFound } = require('../utils/errors');

const getAll = asyncHandler(async (req, res) => {
  res.json(await Category.findAll());
});

const getOne = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw notFound('Категорію');
  res.json(category);
});

const create = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name: name.trim(), description });
  res.status(201).json(category);
});

const update = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const data = {};
  if (name !== undefined) data.name = name.trim();
  if (description !== undefined) data.description = description;
  res.json(await Category.update(req.params.id, data));
});

const remove = asyncHandler(async (req, res) => {
  await Category.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getOne, create, update, remove };
