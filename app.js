const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');
const auth = require('./middlewares/auth');
// импортируем controllers
const { createUser, login } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);
app.use('/', routerUser);
app.use('/', routerCards);
app.use('*', (req, res, next) => {
  const err = new Error('Cтраница не найдена');
  err.statusCode = 404;

  next(err);
});

app.use(errors());

app.use((err, req, res) => {
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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
