// создадим express router
const api = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const cors = require('../middlewares/cors');
const routerUser = require('./users');
const routerCards = require('./cards');
const auth = require('../middlewares/auth');
// импортируем controllers
api.post('/signup', cors, celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

api.post('/signin', cors, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

api.get('/crash-test', cors, () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

api.use(auth);
api.use('/', routerUser);
api.use('/', routerCards);
api.use('*', (req, res, next) => {
  const err = new Error('Cтраница не найдена');
  err.statusCode = 404;

  next(err);
});

// экспортируем router
module.exports = api;
