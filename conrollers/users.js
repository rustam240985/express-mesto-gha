const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      return res.status(500).send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      const { name, about, avatar, _id } = user;
      res.send({ name, about, avatar, _id });
    })
    .catch((err) => {
      if (err.name === 'CastError') return res.status(500).send({ message: 'Пользователь по указанному _id не найден.' });
      return res.status(500).send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) return Promise.reject(new Error('Пользователь по указанному _id не найден.'));
      return res.send({ name: user.name, about: user.about, avatar: user.avatar, _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      if (err.name === 'Error') return res.status(404).send({ message: err.message });
      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) return Promise.reject(new Error('Пользователь по указанному _id не найден.'));
      return res.send({ name: user.name, about: user.about, avatar: user.avatar, _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      if (err.name === 'Error') return res.status(404).send({ message: err.message });
      return res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
};
