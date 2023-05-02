const usersRouter = require('express').Router();
const {
  updateInfoUser, getOwner,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const {
  usersPatchValidation,
} = require('../utils/validation');

usersRouter.get('/me', auth, getOwner);
usersRouter.patch('/me', auth, usersPatchValidation, updateInfoUser);

module.exports = usersRouter;
