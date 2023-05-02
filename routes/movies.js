const moviesRouter = require('express').Router();
const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');
const auth = require('../middlewares/auth');
const {
  moviesCreateValidation, moviesDeleteValidation,
} = require('../utils/validation');

moviesRouter.get('/', auth, getMovies);

moviesRouter.post('/', auth, moviesCreateValidation, createMovie);

moviesRouter.delete('/:movieId', auth, moviesDeleteValidation, deleteMovieById);

module.exports = moviesRouter;
