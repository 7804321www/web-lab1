const { AppError } = require('../utils/errors');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Перевірка одного поля за правилами. Повертає текст помилки або null
const checkField = (name, value, rule) => {
  const missing = value === undefined || value === null || value === '';

  if (missing) {
    return rule.required ? `Поле "${name}" є обов'язковим` : null;
  }

  switch (rule.type) {
    case 'string':
      if (typeof value !== 'string') return `Поле "${name}" має бути рядком`;
      if (rule.min && value.trim().length < rule.min)
        return `Поле "${name}" має містити мінімум ${rule.min} символів`;
      if (rule.max && value.length > rule.max)
        return `Поле "${name}" має містити максимум ${rule.max} символів`;
      if (rule.email && !EMAIL_RE.test(value))
        return `Поле "${name}" має бути коректною email-адресою`;
      if (rule.oneOf && !rule.oneOf.includes(value))
        return `Поле "${name}" має бути одним із: ${rule.oneOf.join(', ')}`;
      break;
    case 'int':
      if (!Number.isInteger(value) || value < 1)
        return `Поле "${name}" має бути додатним цілим числом`;
      break;
    case 'boolean':
      if (typeof value !== 'boolean') return `Поле "${name}" має бути true або false`;
      break;
    case 'stringArray':
      if (!Array.isArray(value) || value.some((v) => typeof v !== 'string' || !v.trim()))
        return `Поле "${name}" має бути масивом непорожніх рядків`;
      break;
    default:
      break;
  }
  return null;
};

// Фабрика middleware: validateBody({ title: { type: 'string', required: true } })
// При partial = true обов'язковість полів не перевіряється (для PUT/PATCH)
const validateBody = (schema, { partial = false } = {}) => (req, res, next) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return next(new AppError(400, 'Тіло запиту має бути JSON-об\'єктом'));
  }

  const errors = [];
  for (const [name, rule] of Object.entries(schema)) {
    const effectiveRule = partial ? { ...rule, required: false } : rule;
    const error = checkField(name, body[name], effectiveRule);
    if (error) errors.push(error);
  }

  if (partial && !Object.keys(schema).some((name) => body[name] !== undefined)) {
    errors.push(`Потрібно передати хоча б одне поле: ${Object.keys(schema).join(', ')}`);
  }

  if (errors.length) return next(new AppError(400, 'Помилка валідації', errors));
  next();
};

// Перевірка параметра маршруту :id (або іншого) як додатного цілого числа
const validateId = (param = 'id') => (req, res, next) => {
  const value = Number(req.params[param]);
  if (!Number.isInteger(value) || value < 1) {
    return next(new AppError(400, `Параметр "${param}" має бути додатним цілим числом`));
  }
  req.params[param] = value;
  next();
};

module.exports = { validateBody, validateId };
