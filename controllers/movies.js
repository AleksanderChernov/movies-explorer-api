const Movie = require('../models/movie');

const NotFoundErr = require('../middlewares/errors/NotFoundErr');
const WrongInfoErr = require('../middlewares/errors/WrongInfoErr');
const NoRightsErr = require('../middlewares/errors/NoRightsErr');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameEN,
    nameRU,
  } = req.body;
  const movieId = req.body.id;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameEN,
    nameRU,
    owner,
    movieId,
  })
    .then((movie) => res.send({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailer,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
      nameEN: movie.nameEN,
      nameRU: movie.nameRU,
      owner: movie.owner,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongInfoErr('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundErr('Фильм по заданному id отсутствует в базе');
    })
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        next(new NoRightsErr('Вы можете удалять только свои фильмы'));
      } else {
        movie.remove().then(() => res.send({ message: `Фильм ${movie.nameEN} удален` }));
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(() => {
      throw new NotFoundErr('У вас нет внесенных фильмов');
    })
    .then((movie) => {
      res.send(movie)
        .catch(next);
    })
    .catch((err) => {
      next(err);
    });
};
