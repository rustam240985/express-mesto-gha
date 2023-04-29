const cardsRouter = require('express').Router();
const { ...cards } = require('../controllers/cards');
const { validateCreateCard, validateIdCard } = require('../middlewares/validate-req-card');

cardsRouter.get('/', cards.getCards);
cardsRouter.delete('/:cardId/likes', validateIdCard, cards.dislikeCard);
cardsRouter.delete('/:cardId', validateIdCard, cards.deleteCard);
cardsRouter.post('/', validateCreateCard, cards.createCard);
cardsRouter.put('/:cardId/likes', validateIdCard, cards.likeCard);

module.exports = cardsRouter;
