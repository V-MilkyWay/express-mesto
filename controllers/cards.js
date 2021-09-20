const Card = require('../models/card.js');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.name === "ValidationError") {
        // Логика обработки ошибки
        const err = new Error('Переданы некорректные данные при создании карточки');
        err.statusCode = 400;

        next(err);
      }
      next(err);
    });
};


module.exports.findAllCards = (req, res, next) => {
  Card.find({})
    .then(card => res.send({ data: card }))
    .catch(next);
};

module.exports.findByIdAndRemoveCard = (req, res, next) => {

  Card.findById(req.params.cardId)
    .then(card => {
      if (!card) {

        const err = new Error('Карточка с указанным _id не найден');
        err.statusCode = 404;

        next(err);

      } else {
        if (req.user._id != card.owner) {
          const err = new Error('Отказано в доступе');
          err.statusCode = 403;

          next(err);
        }
        else {
          card.remove();
          return res.send({ data: card })
        }
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        // Логика обработки ошибки
        const err = new Error('Переданы некорректные данные');
        err.statusCode = 400;

        next(err);
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {

  Card.findByIdAndUpdate(

    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then(card => {
      if (!card) {
        const err = new Error('Пользователь с указанным _id не найден');
        err.statusCode = 404;

        next(err);
      } else {
        return res.send({ data: card })
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        // Логика обработки ошибки
        const err = new Error('Переданы некорректные данные для постановки лайка');
        err.statusCode = 400;

        next(err);
      }
      next(err);
    })
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(

    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then(card => {
      if (!card) {
        const err = new Error('Пользователь с указанным _id не найден');
        err.statusCode = 404;

        next(err);
      } else {
        return res.send({ data: card })
      }
    })
    .catch(err => {
      if (err.name === "CastError") {
        // Логика обработки ошибки
        const err = new Error('Переданы некорректные данные для снятия лайка');
        err.statusCode = 400;

        next(err);
      }
      next(err);
    })
}