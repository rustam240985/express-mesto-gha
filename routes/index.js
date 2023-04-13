const router = require('express').Router();
const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.all('/*', (req, res) => {
  res.status(404).json({ message: 'Такая страница не существует' });
});

module.exports = router;
