const router = require('express').Router();
const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.all('/*', (req, res) => {
  const ERROR_CODE = 404;
  res.status(ERROR_CODE).json({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

module.exports = router;
