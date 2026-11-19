const crypto = require('crypto');

// Хешування пароля вбудованим crypto.scrypt (без зовнішніх залежностей)
const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) return reject(err);
      resolve(`${salt}:${derived.toString('hex')}`);
    });
  });

const verifyPassword = (password, stored) =>
  new Promise((resolve, reject) => {
    const [salt, key] = stored.split(':');
    crypto.scrypt(password, salt, 64, (err, derived) => {
      if (err) return reject(err);
      resolve(crypto.timingSafeEqual(Buffer.from(key, 'hex'), derived));
    });
  });

module.exports = { hashPassword, verifyPassword };
