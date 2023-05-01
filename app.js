require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./utils/limiter');
const mongodb = require('./utils/mongodb');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const error = require('./middlewares/error');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const {
  createUser, login,
} = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(mongodb);
mongoose.set('strictQuery', false);

app.use(requestLogger);

app.use(limiter);
app.use(helmet());
app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
