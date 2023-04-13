const cardsRouter = require('express').Router();
const { createCard, getCards, deleteCard, likeCard, dislikeCard } = require('../conrollers/cards');

cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId/likes', dislikeCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.post('/', createCard);
cardsRouter.put('/:cardId/likes', likeCard);

module.exports = cardsRouter;
