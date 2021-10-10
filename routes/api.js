const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const routerUser = require('./users');
const routerCards = require('./cards');
// auth = require('../middlewares/auth');
const { requestLogger, errorLogger } = require('../middlewares/logger');
// импортируем controllers
const { createUser, login } = require('../controllers/users');

router.use(requestLogger);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

router.use('/', routerUser);
router.use('/', routerCards);
router.use('*', (req, res, next) => {
  const err = new Error('Cтраница не найдена');
  err.statusCode = 404;

  next(err);
});

router.use(errorLogger);

router.use(errors());

router.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

module.exports = router;
