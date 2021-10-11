const allowedCors = [
  'https://your.mesto.nomoredomains.club',
  'http://your.mesto.nomoredomains.club',
  'http://localhost:3001',
  'https://localhost:3001',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://62.84.114.117',
  'https://62.84.114.117',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const reqHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.headers('Access-Control-Allow-Origin', origin);
    res.headers('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.headers('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.headers('Access-Control-Allow-Headers', reqHeaders);
    res.status(200).send();
    return;
  }
  next();
};

module.exports = cors;
