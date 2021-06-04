const jwt = require('jsonwebtoken');
const WrongPassOrMail = require('./errors/WrongPassOrMail');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new WrongPassOrMail('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'devsecret');
  } catch (err) {
    throw new WrongPassOrMail('Необходима авторизация');
  }

  req.user = payload;

  next();
};
