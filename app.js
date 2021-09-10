const express = require('express');
const mongoose = require('mongoose');
const routerUser = require('./routes/users.js');
const routerCards = require('./routes/cards.js');

mongoose.connect('mongodb://localhost:27017/mestodb');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "613a1fb6d53a52cc653b6914"
  };

  next();
});

app.use('/', routerUser);
app.use('/', routerCards);

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
});