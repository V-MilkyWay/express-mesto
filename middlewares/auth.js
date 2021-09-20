
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  if (!req.cookies.jwt) {

    return res
      .status(403)
      .send({ message: 'Необходима авторизация' });
  }

  const token = req.cookies.jwt.token;
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(403)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next()
};