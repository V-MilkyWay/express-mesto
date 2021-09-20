const express = require('express');
const mongoose = require('mongoose');
const routerUser = require('./routes/users.js');
const routerCards = require('./routes/cards.js');
const auth = require('./middlewares/auth.js');
const cookieParser = require('cookie-parser');
// импортируем controllers
const { createUser, login } = require('./controllers/users.js');


mongoose.connect('mongodb://localhost:27017/mestodb');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);
app.use('/', routerUser);
app.use('/', routerCards);
app.use('*', function(req, res){
  res.status(404).send({ message: 'Cтраница не найдена' });
});


app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
});