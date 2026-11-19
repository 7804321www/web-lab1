const User = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');
const { notFound } = require('../utils/errors');
const { hashPassword } = require('../utils/password');
const { getPagination } = require('../utils/pagination');

const getAll = asyncHandler(async (req, res) => {
  const { page, limit, skip, take } = getPagination(req.query);
  const [users, total] = await User.findAll({ skip, take });
  res.json({ data: users, meta: { page, limit, total } });
});

const getOne = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw notFound('Користувача');
  res.json(user);
});

const create = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  const user = await User.create({
    email: email.trim().toLowerCase(),
    username: username.trim(),
    passwordHash: await hashPassword(password),
    ...(role ? { role } : {}),
  });
  res.status(201).json(user);
});

const update = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  const data = {};
  if (email !== undefined) data.email = email.trim().toLowerCase();
  if (username !== undefined) data.username = username.trim();
  if (password !== undefined) data.passwordHash = await hashPassword(password);
  if (role !== undefined) data.role = role;

  const user = await User.update(req.params.id, data);
  res.json(user);
});

const remove = asyncHandler(async (req, res) => {
  await User.remove(req.params.id);
  res.status(204).send();
});

module.exports = { getAll, getOne, create, update, remove };
