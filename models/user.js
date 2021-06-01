const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const WrongPassOrMail = require('../middlewares/errors/WrongPassOrMail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Поле name должно содержать минимум 2 символа'],
    maxlength: 30,
    default: 'Акира Куросава',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Невалидная почта',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new WrongPassOrMail('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new WrongPassOrMail('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
