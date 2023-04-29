const { Joi, celebrate } = require('celebrate');
const { urlPattern } = require('../utils/constants');

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(urlPattern).required(),
  }),
});

const validateIdCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }).unknown(),
});

module.exports = {
  validateCreateCard,
  validateIdCard,
};
