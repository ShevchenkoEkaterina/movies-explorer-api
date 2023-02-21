const allowedCors = [
  'https://she15.students.nomoredomainsclub.ru',
  'http://she15.students.nomoredomainsclub.ru',
  'localhost:3000',
];

const allowOrigin = (req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
};

const allowOptions = (req, res) => {
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
  }
  return res.end();
};

module.exports = {
  allowOrigin, allowOptions,
};
