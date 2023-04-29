const { Joi, celebrate } = require('celebrate');

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/^(http|https):\/\/(www\.)?([A-Za-zА-Яа-яё0-9]([A-Za-zА-Яа-яё0-9-]*[A-Za-zА-Яа-я0-9])*\.?)*\.{1}[A-Za-zА-Яа-я]{2,8}(\/([\w#$~_[\]!:.?+=&%*,;@!\-/])*)?$/).required(),
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
