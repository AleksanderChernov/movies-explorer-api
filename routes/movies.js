const router = require('express').Router();
const {
  createMovie, getMovies, deleteMovie,
} = require('../controllers/movies');

const { movieValidator, movieIdValidator } = require('../middlewares/validator');

router.get('/', getMovies);
router.post('/', movieValidator, createMovie);
router.delete('/:movieId', movieIdValidator, deleteMovie);

module.exports = router;
