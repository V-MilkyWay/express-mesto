require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

mongoose.connect('mongodb://localhost:27017/mestodb');

const api = require('./routes/api');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api', api);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
