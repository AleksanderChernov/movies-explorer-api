const express = require('express');
require('dotenv').config();
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

const cors = require('cors');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');
const errorHandler = require('./middlewares/error-handler');
const NotFoundErr = require('./middlewares/errors/NotFoundErr');
const auth = require('./middlewares/auth');
const { loginValidator } = require('./middlewares/validator');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://ancher-movies-project.nomoredomains.icu',
  credentials: true,
}));
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', loginValidator, login);
app.post('/signup', loginValidator, createUser);

app.use('/', auth);
app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

app.use(() => {
  throw new NotFoundErr('Ошибка 404. Такой страницы не существует');
});

app.use((err, req, res) => {
  res.status(500).send({ message: 'Произошла ошибка на сервере' });
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => (`App listening on port ${PORT}`));
