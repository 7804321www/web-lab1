const { PrismaClient } = require('@prisma/client');

// Єдиний екземпляр клієнта на весь застосунок
const prisma = new PrismaClient();

module.exports = prisma;
