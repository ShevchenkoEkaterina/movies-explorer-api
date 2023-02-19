const mongoose = require('mongoose');
const Movie = require('../models/movie');
const SomethingWrongError = require('../errors/not-found-err');
const NotAutorizedError = require('../errors/not-authorized-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner', 'likes'])
    .then((movie) => res.status(200).send(movie))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  return Movie.create({ name, link, owner })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new SomethingWrongError('Переданы некорректные данные при создании фильма.'));
      }
      return next(err);
    });
};

const deleteMovieById = (req, res, next) => {
  const ownerId = req.user._id;
  const { MovieId } = req.params;
  return Movie.findById(MovieId)
    .then((movie) => {
      if (String(movie.owner) === ownerId) {
        return movie.remove();
      }
      throw new NotAutorizedError('Невозможно удалить чужую фильм.');
    })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new SomethingWrongError('Передан невалидный id.'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies, createMovie, deleteMovieById,
};
