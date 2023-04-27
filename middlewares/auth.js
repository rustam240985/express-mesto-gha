const jwt = require('jsonwebtoken');
const JwtError = require('../errors/jwt-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  let payload;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new JwtError('Необходима авторизация');
    }
    const extractBearerToken = (header) => header.replace('Bearer ', '');
    const token = extractBearerToken(authorization);

    payload = jwt.verify(token, 'f5948eb3fb322d4b2956fd2b75c78e6eebd0deafa8561d0182e73dd9fbc20490');
  } catch (err) {
    next(err);
  }
  req.user = payload;

  next();
};
