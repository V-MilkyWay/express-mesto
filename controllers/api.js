module.exports.api = (req, res, next) => {
  app.post('/signup', cors, celebrate({
    body: Joi.object().keys({
      name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
      about: Joi.string().default('Исследователь').min(2).max(30),
      avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }), createUser);

  app.post('/signin', cors, celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }), login);

  app.get('/crash-test', cors, () => {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  });

  app.use(auth);
  app.use('/', routerUser);
  app.use('/', routerCards);
  app.use('*', (req, res, next) => {
    const err = new Error('Cтраница не найдена');
    err.statusCode = 404;

    next(err);
  });
};
