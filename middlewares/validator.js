const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const urlValidationMethod = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Ошибка в ссылке');
};

module.exports.profileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина имени - 2 символа',
        'string.max': 'Максимальная длина имени - 30 символов',
        'any.required': 'Напишите новое имя',
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': 'Необходимо написать email',
      }),
  }),
});

module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(8)
      .messages({
        'string.min': 'Минимальная длина пароля - 8 символов',
        'any.required': 'Необходимо заполнить поле',
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': 'Необходимо заполнить поле',
      }),
  }),
});

module.exports.registerValidator = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(8)
      .messages({
        'string.min': 'Минимальная длина пароля - 8 символов',
        'any.required': 'Необходимо заполнить поле',
      }),
    email: Joi.string().required().email()
      .messages({
        'any.required': 'Необходимо заполнить поле',
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина имени - 2 символа',
        'string.max': 'Максимальная длина имени - 30 символов',
        'any.required': 'Напишите новое имя',
      }),
  }),
});

module.exports.movieIdValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required()
      .messages({
        'any.required': 'Необходимо внести id (номер) фильма',
      }),
  }),
});

module.exports.movieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required()
      .messages({
        'any.required': 'Необходимо заполнить поле страны производства',
      }),
    director: Joi.string().required()
      .messages({
        'any.required': 'Необходимо заполнить поле режиссера',
      }),
    duration: Joi.string().required()
      .messages({
        'any.required': 'Необходимо заполнить поле продолжительности',
      }),
    year: Joi.string().required()
      .messages({
        'any.required': 'Необходимо заполнить поле года производства',
      }),
    description: Joi.string().required()
      .messages({
        'any.required': 'Необходимо заполнить поле описания',
      }),
    image: Joi.string().required().custom(urlValidationMethod)
      .messages({
        'any.required': 'Постер должен быть валидной ссылкой',
      }),
    trailer: Joi.string().required().custom(urlValidationMethod)
      .messages({
        'any.required': 'Трейлер должен быть валидной ссылкой',
      }),
    thumbnail: Joi.string().required().custom(urlValidationMethod)
      .messages({
        'any.required': 'Миниатюрное изображение должно быть валидной ссылкой',
      }),
    nameRU: Joi.string().required()
      .messages({
        'any.required': 'Необходимо заполнить поле названия фильма в России',
      }),
    nameEN: Joi.string().required()
      .messages({
        'any.required': 'Необходимо заполнить поле назввания фильма в англоязычных странах',
      }),
    _id: Joi.string().required()
      .messages({
        'any.required': 'Необходимо внести идентификатор фильма (число)',
      }),
  }),
  params: Joi.object().keys({
    owner: Joi.string().alphanum().length(24).hex(),
  }),
});
