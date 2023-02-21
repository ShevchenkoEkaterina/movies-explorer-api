const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateInformationUser, updateAvatarUser, getOwner,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const regex = require('../utils/constants');

usersRouter.get('/', auth, getUsers);
usersRouter.get('/me', auth, getOwner);
usersRouter.get('/:userId', auth, celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);
usersRouter.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateInformationUser);
usersRouter.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
}), updateAvatarUser);

module.exports = usersRouter;
