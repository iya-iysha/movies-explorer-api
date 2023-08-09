const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

const { validateCreateMovie, validateGetMovieById } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateGetMovieById, deleteMovieById);

module.exports = router;
