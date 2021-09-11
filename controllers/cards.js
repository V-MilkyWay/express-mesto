const Card = require('../models/card.js');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.name === "ValidationError") {
        // Логика обработки ошибки
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.findAllCards = (req, res) => {
  Card.find({})
    .then(card => res.send({ data: card }))
    .catch(err => {

      return res.status(500).send({ message: err.message });
    });
};

module.exports.findByIdAndRemoveCard = (req, res) => {

  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найден' });
      } else {
        return res.send({ data: card })
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        // Логика обработки ошибки
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {

  Card.findByIdAndUpdate(

    /* test
    req.params._id = {
      _id: "613a505e786980f660dc8af3"
    }
    */

    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        return res.send({ data: card })
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        // Логика обработки ошибки
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(500).send({ message: err.message });
    })
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(

    /* test
    req.params._id = {
      _id: "613a505e786980f660dc8af3"
    }
    */

    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        return res.send({ data: card })
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        // Логика обработки ошибки
        return res.status(400).send({ message: 'Переданы некорректные данные для снятии лайка' });
      }
      return res.status(500).send({ message: err.message });
    })
}