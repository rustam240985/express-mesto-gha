const { ERROR_VALIDATE_CODE } = require('../utils/constants');

const Card = require('../models/card');
const DelCardError = require('../errors/delete-card-err');
const NotFoundError = require('../errors/not-found-err');

const errorDataNull = new Error('Карточка по указанному _id не найдена.');
errorDataNull.name = 'NullError';

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: _id,
  })
    .then((card) => {
      card.populate('owner').then((cardPop) => res.send(cardPop));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.message = 'Переданы некорректные данные при создании карточки';
        err.statusCode = ERROR_VALIDATE_CODE;
      }
      next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate('likes')
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: ownerId } = req.user;

  Card.findById({ _id: cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким _id не найдена.');
      }
      if (card.owner.toString() !== ownerId) {
        throw new DelCardError('Можно удалять только собственные посты');
      }
      card.deleteOne().then((result) => {
        res.send({ message: 'Пост удален' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.message = 'Переданы некорректный _id карточки';
        err.statusCode = ERROR_VALIDATE_CODE;
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким _id не найдена.');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.message = 'Переданы некорректные данные для постановки лайка.';
        err.statusCode = ERROR_VALIDATE_CODE;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const { _id } = req.user;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true, runValidators: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким _id не найдена.');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.message = 'Переданы некорректные данные для постановки лайка.';
        err.statusCode = ERROR_VALIDATE_CODE;
      }
      next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
