const cardsRouter = require('express').Router();
const { createCard, getCards, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
const { validateCreateCard, validateIdCard } = require('../middlewares/validate-req-card');

cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId/likes', validateIdCard, dislikeCard);
cardsRouter.delete('/:cardId', validateIdCard, deleteCard);
cardsRouter.post('/', validateCreateCard, createCard);
cardsRouter.put('/:cardId/likes', validateIdCard, likeCard);

module.exports = cardsRouter;
