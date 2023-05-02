const mongoose = require('mongoose');
const Movie = require('../models/movie');
const InvalidDataError = require('../errors/invalid-data-err');
const HttpForbiddenError = require('../errors/http-forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const InvalidDataErrorMessage = require('../utils/invalid-data-err-message');
const HttpForbiddenErrorMessage = require('../utils/http-forbidden-err-message');
const NotFoundErrorMessage = require('../utils/not-found-err-message');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  return Movie.find({ owner })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description, image, trailerLink, thumbnail, movieId,
    nameRU, nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new InvalidDataError(InvalidDataErrorMessage));
      }
      return next(err);
    });
};

const deleteMovieById = (req, res, next) => {
  const ownerId = req.user._id;
  const { movieId } = req.params;
  return Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NotFoundErrorMessage);
      }
      if (String(movie.owner) === ownerId) {
        return movie.remove();
      }
      throw new HttpForbiddenError(HttpForbiddenErrorMessage);
    })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new InvalidDataError(InvalidDataErrorMessage));
      }
      return next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovieById,
};
