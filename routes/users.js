// создадим express router
const routerUser = require('express').Router();
// импортируем controllers
const { findAllUsers, findUserById, updateProfile, updateAvatar, infoAboutUser } = require('../controllers/users.js');

routerUser.get('/users', findAllUsers);

routerUser.get('/users/me', infoAboutUser);

routerUser.get('/users/:userId', findUserById);

routerUser.patch('/users/me', updateProfile);

routerUser.patch('/users/me/avatar', updateAvatar);

// экспортируем router
module.exports = routerUser;