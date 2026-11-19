// Клас для помилок, які ми кидаємо самі (з HTTP-статусом)
class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const notFound = (entity) => new AppError(404, `${entity} не знайдено`);

module.exports = { AppError, notFound };
