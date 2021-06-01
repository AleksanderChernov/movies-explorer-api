const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundErr = require('../middlewares/errors/NotFoundErr');
const EmailDoubledErr = require('../middlewares/errors/EmailDoubledErr');
const WrongInfoErr = require('../middlewares/errors/WrongInfoErr');
const WrongPassOrMail = require('../middlewares/errors/WrongPassOrMail');

module.exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Нет пользователя с таким id');
      }
      res.send({ name: user.name, email: user.email });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  if (req.body.password.length >= 8) {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      }))
      .then((user) => res.status(201).send({
        name: user.name,
        _id: user._id,
        email: user.email,
      }))
      .catch((err) => {
        if (err.kind === 'ValidationError') {
          next(new WrongInfoErr({ message: 'Переданы некорректные данные при обновлении пользователя' }));
        } else if (err.name === 'MongoError' && err.code === 11000) {
          next(new EmailDoubledErr('Такой e-mail уже существует в базе'));
        } else if (err.statusCode === 400) {
          next(new WrongInfoErr('Переданы некорректные данные при создании пользователя'));
        } else {
          next(err);
        }
      });
  } else {
    throw new WrongInfoErr('Переданы некорректные данные при создании пользователя');
  }
};

module.exports.modifyUser = (req, res, next) => {
  const filter = req.user._id;
  User.findByIdAndUpdate(filter, { $set: req.body }, { new: true, runValidators: true })
    .orFail(() => {
      next(new NotFoundErr('Пользователь по заданному id отсутствует в базе'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.kind === 'ValidationError') {
        next(new WrongInfoErr({ message: 'Переданы некорректные данные при обновлении пользователя' }));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'devsecret', { expiresIn: '7d' });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new WrongPassOrMail('Передан неправильный e-mail или пароль'));
      } else {
        next(err);
      }
    });
};
