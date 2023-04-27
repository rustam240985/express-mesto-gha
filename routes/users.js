const usersRouter = require('express').Router();
const { getUsers, getUser, updateUser, updateAvatar, getCurrentUser } = require('../controllers/users');
const { validateUpdateAvatar, validateUserId, validateUser } = require('../middlewares/validate-req-user');

usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', validateUserId, getUser);
usersRouter.get('/', getUsers);
usersRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);
usersRouter.patch('/me', validateUser, updateUser);

module.exports = usersRouter;
