const { ERROR_VALIDATE_CODE } = require('../utils/constants');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_VALIDATE_CODE;
  }
}

module.exports = ValidationError;
