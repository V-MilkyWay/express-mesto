require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const api = require('./routes/api');
const apiMain = require('./routes/apiMain');

mongoose.connect('mongodb://localhost:27017/mestodb');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/api', api);
app.use(auth);
app.use('/api', apiMain);
app.use(errorLogger);

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
