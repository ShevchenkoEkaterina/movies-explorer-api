const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');
const auth = require('../middlewares/auth');
const regex = require('../utils/constants');

moviesRouter.get('/', auth, getMovies);

moviesRouter.post('/', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regex),
    trailerLink: Joi.string().required().pattern(regex),
    thumbnail: Joi.string().required().pattern(regex),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.required(),
  }),
}), createMovie);

moviesRouter.delete('/:_id', auth, celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovieById);

module.exports = moviesRouter;
