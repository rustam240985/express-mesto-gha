const usersRouter = require('express').Router();
const { createUser, getUsers, getUser, updateUser, updateAvatar } = require('../conrollers/users');

usersRouter.get('/:userId', getUser);
usersRouter.get('/', getUsers);
usersRouter.post('/', createUser);
usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.patch('/me', updateUser);

module.exports = usersRouter;
