const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');
const NotFoundErrorMessage = require('../utils/not-found-err-message');
const {
  createUser, login,
} = require('../controllers/users');
const {
  signupValidation, signinValidation,
} = require('../utils/validation');

router.post('/signup', signupValidation, createUser);
router.post('/signin', signinValidation, login);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError(NotFoundErrorMessage));
});

module.exports = router;
