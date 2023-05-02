require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const NotAutorizedError = require('../errors/not-authorized-err');
const NotAutorizedErrorMessage = require('../utils/not-authorized-err-message');

const { JWT_SECRET = 'dev-secret-key' } = process.env;

const auth = ((req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NotAutorizedError(NotAutorizedErrorMessage));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new NotAutorizedError(NotAutorizedErrorMessage));
  }
  req.user = payload;
  return next();
});

module.exports = auth;
