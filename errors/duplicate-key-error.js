const { ERROR_DUPLICATE_CODE } = require('../utils/constants');

class DuplicateKeyError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_DUPLICATE_CODE;
  }
}

module.exports = DuplicateKeyError;
