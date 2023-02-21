const jwt = require('jsonwebtoken');
const NotAutorizedError = require('../errors/not-authorized-err');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports = ((req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NotAutorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new NotAutorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
});
