require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const InvalidDataError = require('../errors/invalid-data-err');
const AlreadyExistsError = require('../errors/already-exists-err');
const AlreadyExistsErrorMessage = require('../utils/already-exists-err-message');
const InvalidDataErrorMessage = require('../utils/invalid-data-err-message');

const { JWT_SECRET = 'dev-secret-key', NODE_ENV } = process.env;

const getOwner = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then(({
      name, email,
    }) => res.status(200).send({
      name, email,
    }))
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
        return next(new InvalidDataError(InvalidDataErrorMessage));
      }
      if (err.code === 11000) {
        return next(new AlreadyExistsError(AlreadyExistsErrorMessage));
      }
      return next(err);
    });
};

const updateInfoUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  return User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then(() => res.status(200).send({ name, email }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new InvalidDataError(InvalidDataErrorMessage));
      }
      if (err.code === 11000) {
        return next(new AlreadyExistsError(AlreadyExistsErrorMessage));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  getOwner, createUser, updateInfoUser, login,
};
