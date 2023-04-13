const Card = require('../models/card');

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
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      return res.status(500).send({ message: err.message });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .populate('likes')
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(500).send({ message: err.message });
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
      if (!_id) {
        return Promise.reject(new Error('Переданы некорректные данные для постановки лайка.'));
      }
      return res.send({ likes: card.likes });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(500).send({ message: err.message });
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
      if (!_id) {
        return Promise.reject(new Error('Переданы некорректные данные для снятия лайка.'));
      }
      return res.send({ likes: card.likes });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
