const { celebrate, Joi } = require('celebrate');
// создадим express router
const routerCards = require('express').Router();
// импортируем controllers
const {
  createCard,
  findAllCards,
  findByIdAndRemoveCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
  }),
}), createCard);

routerCards.get('/', findAllCards);

routerCards.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), findByIdAndRemoveCard);

routerCards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), likeCard);

routerCards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), dislikeCard);

// экспортируем router
module.exports = routerCards;
