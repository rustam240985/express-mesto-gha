const ERROR_VALIDATE_CODE = 400;
const ERROR_DEFAULT_CODE = 500;
const ERROR_NULL_CODE = 404;
const ERROR_JWT_CODE = 401;
const ERROR_DUPLICATE_CODE = 409;
const ERROR_DEL_CODE = 403;

const urlPattern = /^(http|https):\/\/(www\.)?([A-Za-zА-Яа-яё0-9]([A-Za-zА-Яа-яё0-9-]*[A-Za-zА-Яа-я0-9])*\.?)*\.{1}[A-Za-zА-Яа-я]{2,8}(\/([\w#$~_[\]!:.?+=&%*,;@!\-/])*)?$/;

module.exports = {
  ERROR_DEFAULT_CODE,
  ERROR_NULL_CODE,
  ERROR_VALIDATE_CODE,
  ERROR_JWT_CODE,
  ERROR_DUPLICATE_CODE,
  ERROR_DEL_CODE,
  urlPattern,
};
