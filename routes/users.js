const usersRouter = require('express').Router();
const { ...users } = require('../controllers/users');
const { validateUpdateAvatar, validateUserId, validateUser } = require('../middlewares/validate-req-user');

usersRouter.get('/me', users.getCurrentUser);
usersRouter.get('/:userId', validateUserId, users.getUser);
usersRouter.get('/', users.getUsers);
usersRouter.patch('/me/avatar', validateUpdateAvatar, users.updateAvatar);
usersRouter.patch('/me', validateUser, users.updateUser);

module.exports = usersRouter;
