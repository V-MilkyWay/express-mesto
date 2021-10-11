const { celebrate, Joi } = require('celebrate');
// создадим express router
const routerUser = require('express').Router();
// импортируем controllers
const {
  findAllUsers,
  findUserById,
  updateProfile,
  updateAvatar,
  infoAboutUser,
} = require('../controllers/users');

routerUser.get('/', findAllUsers);

routerUser.get('/me', infoAboutUser);

routerUser.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), findUserById);

routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

routerUser.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
  }),
}), updateAvatar);

// экспортируем router
module.exports = routerUser;
