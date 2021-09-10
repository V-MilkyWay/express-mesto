// создадим express router
const routerCards = require('express').Router();
// импортируем controllers
const { createCard, findAllCards, findByIdAndRemoveCard, likeCard, dislikeCard } = require('../controllers/cards.js');

routerCards.post('/cards', createCard);

routerCards.get('/cards', findAllCards);

routerCards.delete('/cards/:cardId', findByIdAndRemoveCard);

routerCards.put('/cards/:cardId/likes', likeCard);

routerCards.delete('/cards/:cardId/likes', dislikeCard);

// экспортируем router
module.exports = routerCards;