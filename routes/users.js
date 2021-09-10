// создадим express router
const routerUser = require('express').Router();
// импортируем controllers
const { createUser, findAllUsers, findUserById, updateProfile, updateAvatar } = require('../controllers/users.js');

routerUser.get('/user', findAllUsers);

routerUser.get('/users/:userId', findUserById);

routerUser.post('/users', createUser);

routerUser.patch('/users/me', updateProfile);

routerUser.patch('/users/me/avatar', updateAvatar);

// экспортируем router
module.exports = routerUser;