const User = require('../models/user.js');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === "ValidationError") {
        // Логика обработки ошибки
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.findAllUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(err => {

      return res.status(500).send({ message: err.message });
    });
};

module.exports.findUserById = (req, res) => {
  User.findById(req.user._id)
    .then(user =>  {if (!user) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    } else {
      return res.send({ data: user })}
    })
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
    .then(user =>
      {if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        return res.send({ data: user })}
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
    .then(user =>  {if (!user) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    } else {
      return res.send({ data: user })}
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        // Логика обработки ошибки
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(500).send({ message: err.message });
    });
};

