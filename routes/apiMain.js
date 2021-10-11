// создадим express router
const apiMain = require('express').Router();
const routerUser = require('./users');
const routerCards = require('./cards');

apiMain.use('/', routerUser);
apiMain.use('/', routerCards);
apiMain.use('*', (req, res, next) => {
  const err = new Error('Cтраница не найдена');
  err.statusCode = 404;

  next(err);
});

// экспортируем router
module.exports = apiMain;
