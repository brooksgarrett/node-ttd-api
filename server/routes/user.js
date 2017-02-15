const express = require('express');
var routes = express.Router();

const {authenticate} = require('../middleware/authenticate');
const UserCtrl = require('../controllers/user');

routes.post('/register', UserCtrl.create);
routes.post('/login', UserCtrl.login);
routes.delete('/logout', authenticate, UserCtrl.logout);
routes.post('/subscribe/:toneset', authenticate, UserCtrl.subscribe);
routes.delete('/subscribe/:toneset', authenticate, UserCtrl.unsubscribe);
routes.get('/me', authenticate, UserCtrl.info);
routes.patch('/me', authenticate, UserCtrl.update);

module.exports = routes;