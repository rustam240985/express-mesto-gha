const Card = require('../models/card');
const DelCardError = require('../errors/delete-card-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-error');

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
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
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
      card.deleteOne().then(() => {
        res.send({ message: 'Пост удален' });
      })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный id карточки'));
      } else {
        next(err);
      }
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
        next(new ValidationError('Передан некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
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
        next(new ValidationError('Передан некорректные данные для удаления лайка'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
