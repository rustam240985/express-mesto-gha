const { ERROR_DEFAULT_CODE } = require('../utils/constants');

const errorsAll = (err, req, res, next) => {
  const { statusCode = ERROR_DEFAULT_CODE, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_DEFAULT_CODE
        ? `На сервере произошла ошибка ${err}`
        : message,
    });

  next();
};

module.exports = {
  errorsAll,
};
