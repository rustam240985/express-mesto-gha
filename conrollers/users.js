const { ERROR_DEFAULT_CODE, ERROR_NULL_CODE, ERROR_VALIDATE_CODE } = require('../utils/constants');

const User = require('../models/user');

const errorDataNull = new Error('Пользователь по указанному _id не найден.');
errorDataNull.name = 'NullError';

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_VALIDATE_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      return res.status(ERROR_DEFAULT_CODE).send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => res.status(ERROR_DEFAULT_CODE).send({ message: err.message }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById({ _id: userId })
    .then((user) => {
      if (!user) {
        return Promise.reject(errorDataNull);
      }
      const { name, about, avatar, _id } = user;
      return res.send({ name, about, avatar, _id });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(ERROR_VALIDATE_CODE).send({ message: 'Переданы некорректные данные _id' });
      if (err.name === 'NullError') return res.status(ERROR_NULL_CODE).send({ message: err.message });
      return res.status(ERROR_DEFAULT_CODE).send(err.name);
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ name: user.name, about: user.about, avatar: user.avatar, _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_VALIDATE_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      return res.status(ERROR_DEFAULT_CODE).send({ message: `Произошла ошибка ${err}` });
    });
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ name: user.name, about: user.about, avatar: user.avatar, _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_VALIDATE_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      return res.status(ERROR_DEFAULT_CODE).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
};
