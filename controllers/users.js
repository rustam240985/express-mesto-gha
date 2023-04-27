const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const { ERROR_VALIDATE_CODE } = require('../utils/constants');

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.init()
      .then(() => User.create({ name, about, avatar, email, password: hash })))
    .then((newUser) => {
      res.send({
        _id: newUser._id,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = ERROR_VALIDATE_CODE;
        err.message = 'Переданы некорректные данные при создании пользователя';
      } else if (err.code === 11000) {
        err.statusCode = 409;
        err.message = 'Пользователь с таким email уже существует';
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'f5948eb3fb322d4b2956fd2b75c78e6eebd0deafa8561d0182e73dd9fbc20490', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      const { name, about, avatar, _id } = user;
      return res.send({ name, about, avatar, _id });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = ERROR_VALIDATE_CODE;
        err.message = 'Передан некорректный _id';
      }

      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      }
      const { name, about, avatar, email } = user;
      return res.send({ _id, name, about, avatar, email });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.statusCode = ERROR_VALIDATE_CODE;
        err.message = 'Передан некорректный _id';
      }

      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ name: user.name, about: user.about, avatar: user.avatar, _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = ERROR_VALIDATE_CODE;
        err.message = 'Переданы некорректные данные при обновлении профиля.';
      }

      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ name: user.name, about: user.about, avatar: user.avatar, _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.statusCode = ERROR_VALIDATE_CODE;
        err.message = 'Переданы некорректные данные при обновлении аватара.';
      }

      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
};
