require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const SomethingWrongError = require('../errors/not-found-err');
const AlreadyExistsError = require('../errors/already-exists-err');

console.log(process.env.NODE_ENV);
const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then(({
      email, name, about, avatar, _id,
    }) => res.status(201).send({
      email, name, about, avatar, _id,
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

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers, createUser, updateInformationUser, login,
};
