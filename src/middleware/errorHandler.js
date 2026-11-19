const { AppError } = require('../utils/errors');

// 404 для невідомих маршрутів
const notFoundHandler = (req, res, next) => {
  next(new AppError(404, `Маршрут ${req.method} ${req.originalUrl} не існує`));
};

// Перетворення типових помилок Prisma на зрозумілі HTTP-відповіді
const mapPrismaError = (err) => {
  switch (err.code) {
    case 'P2002': {
      const fields = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'поле';
      return new AppError(409, `Запис із таким значенням уже існує (${fields})`);
    }
    case 'P2025':
      return new AppError(404, 'Запис не знайдено');
    case 'P2003':
      return new AppError(400, 'Пов\'язаний запис не існує (некоректний зовнішній ключ)');
    default:
      return null;
  }
};

// Глобальний обробник помилок (має 4 параметри — так Express розпізнає його)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Некоректний JSON у тілі запиту
  if (err.type === 'entity.parse.failed') {
    err = new AppError(400, 'Некоректний JSON у тілі запиту');
  } else if (err.code && typeof err.code === 'string' && err.code.startsWith('P')) {
    err = mapPrismaError(err) || err;
  }

  const status = err.status || 500;
  if (status === 500) console.error(err);

  res.status(status).json({
    error: status === 500 ? 'Внутрішня помилка сервера' : err.message,
    ...(err.details ? { details: err.details } : {}),
  });
};

module.exports = { notFoundHandler, errorHandler };
