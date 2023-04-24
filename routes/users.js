const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
 updateInformationUser, getOwner,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const regex = require('../utils/constants');

usersRouter.get('/me', auth, getOwner);
usersRouter.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateInformationUser);

module.exports = usersRouter;
