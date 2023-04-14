const { ERROR_DEFAULT_CODE, ERROR_NULL_CODE, ERROR_VALIDATE_CODE } = require('../utils/constants');

const Card = require('../models/card');

const errorDataNull = new Error('Переданы некорректные данные _id');
errorDataNull.name = 'NullError';

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: _id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_VALIDATE_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      return res.status(ERROR_DEFAULT_CODE).send({ message: err.message });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .populate('likes')
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => res.status(ERROR_DEFAULT_CODE).send({ message: err.message }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove({ _id: cardId })
    .then((card) => {
      if (!card) {
        return Promise.reject(errorDataNull);
      }
      const { createdAt, name, link, owner, likes } = card;
      return res.send({ createdAt, name, link, owner, likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_VALIDATE_CODE).send({ message: 'Переданы некорректный _id карточки' });
      }
      if (err.name === 'NullError') {
        return res.status(ERROR_NULL_CODE).send({ message: err.message });
      }
      return res.status(ERROR_DEFAULT_CODE).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true, runValidators: true },
  )
    .populate('likes')
    .then((card) => {
      if (!card) {
        return Promise.reject(errorDataNull);
      }
      const { likes } = card;
      return res.send({ likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_VALIDATE_CODE).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      if (err.name === 'NullError') {
        return res.status(ERROR_NULL_CODE).send({ message: err.message });
      }
      return res.status(ERROR_DEFAULT_CODE).send({ message: err.message });
    });
};

const dislikeCard = (req, res) => {
  const { _id } = req.user;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return Promise.reject(errorDataNull);
      }
      const { likes } = card;
      return res.send({ likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_VALIDATE_CODE).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      if (err.name === 'NullError') {
        return res.status(ERROR_NULL_CODE).send({ message: err.message });
      }
      return res.status(ERROR_DEFAULT_CODE).send({ message: err.message });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
