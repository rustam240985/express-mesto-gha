const { Joi, celebrate } = require('celebrate');

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/(http|https):\/\/(\w+:{0,1}\w*#)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&amp;%#!\-/]))?/).required(),
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
