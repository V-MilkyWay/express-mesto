// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://api.your.mesto.nomoredomains.monster/signin',
  'http://api.your.mesto.nomoredomains.monster/signin',
  'localhost:3000',
  'https://your.mesto.nomoredomains.club',
  'http://your.mesto.nomoredomains.club',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
  }

  next();
};
