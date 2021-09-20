const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then(hash =>
      User.create({ name, about, avatar, email, password: hash })
        .then(user => res.send({ data: user }))
        .catch(err => {
          if (err.name === "ValidationError") {
            // Логика обработки ошибки
            return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
          }
          return res.status(500).send({ message: err.message });
        })
    )
};

module.exports.findAllUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(err => {

      return res.status(500).send({ message: err.message });
    });
};

module.exports.findUserById = (req, res) => {

  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        return res.send({ data: user })
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.infoAboutUser = (req, res) => {

  User.findById(req.user._id)
    .then(user => res.send({ data: user }))
    .catch(err => {

      return res.status(500).send({ message: err.message });
    });
};


module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id, { name: name, about: about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false // если пользователь не найден, он будет создан
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        return res.send({ data: user })
      }
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        // Логика обработки ошибки
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar },
    {
      new: true,
      runValidators: true,
      upsert: false
    })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        return res.send({ data: user })
      }
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        // Логика обработки ошибки
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    })
    .then((user) => {
      const jwt = require('jsonwebtoken');

      res.cookie('jwt', {token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' })}, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000,
        httpOnly: true
      })
      .send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' })
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
