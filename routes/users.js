const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateInfoUser, getOwner,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

usersRouter.get('/me', auth, getOwner);
usersRouter.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateInfoUser);

module.exports = usersRouter;
