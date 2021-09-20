const { celebrate, Joi } = require('celebrate');
// создадим express router
const routerUser = require('express').Router();
// импортируем controllers
const { findAllUsers, findUserById, updateProfile, updateAvatar, infoAboutUser } = require('../controllers/users.js');

routerUser.get('/users', findAllUsers);

routerUser.get('/users/me', infoAboutUser);

routerUser.get('/users/:userId', findUserById);

routerUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30)
  })
}), updateProfile);

routerUser.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  })
}), updateAvatar);

// экспортируем router
module.exports = routerUser;