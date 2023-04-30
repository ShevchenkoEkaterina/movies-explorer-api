const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const SomethingWrongError = require('../errors/not-found-err');
const AlreadyExistsError = require('../errors/already-exists-err');

const getOwner = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then(({
      email, name, _id,
    }) => res.status(201).send({
      email, name, _id,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new SomethingWrongError('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new AlreadyExistsError('Такой email уже существует.'));
      }
      return next(err);
    });
};

const updateInformationUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  return User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new SomethingWrongError('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

module.exports = {
  getOwner, createUser, updateInformationUser,
};
