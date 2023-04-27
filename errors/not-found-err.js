const { ERROR_NULL_CODE } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_NULL_CODE;
  }
}

module.exports = NotFoundError;
