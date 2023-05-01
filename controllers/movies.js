const mongoose = require('mongoose');
const Movie = require('../models/movie');
const InvalidDataError = require('../errors/invalid-data-err');
const HttpForbiddenError = require('../errors/http-forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const getMovies = (req, res, next) => {
  const ownerId = req.user._id;
  return Movie.find({ ownerId })
    .then((movie) => res.status(200).send(movie))
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
        return next(new InvalidDataError('Переданы некорректные данные при создании фильма.'));
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
        throw new NotFoundError('Фильм не найден.');
      }
      if (String(movie.owner) === ownerId) {
        return movie.remove();
      }
      throw new HttpForbiddenError('Невозможно удалить чужой фильм.');
    })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new InvalidDataError('Передан невалидный id.'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovieById,
};
