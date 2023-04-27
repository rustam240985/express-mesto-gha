const { ERROR_JWT_CODE } = require('../utils/constants');

class JwtError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_JWT_CODE;
  }
}

module.exports = JwtError;
