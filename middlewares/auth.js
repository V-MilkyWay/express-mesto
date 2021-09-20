
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  if (!req.cookies.jwt) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 401;

    next(err);
  }

  const {token} = req.cookies.jwt;
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    err = new Error('Ошибка авторизации');
    err.statusCode = 401;

    next(err);
  }
  req.user = payload;
  next()
};