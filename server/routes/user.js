const express = require('express');
var routes = express.Router();

const {authenticate} = require('../middleware/authenticate');
const UserCtrl = require('../controllers/user');

routes.post('/register', UserCtrl.create);
routes.post('/login', UserCtrl.login);
routes.delete('/logout', authenticate, UserCtrl.logout);
routes.get('/', authenticate, UserCtrl.info);
routes.patch('/', authenticate, UserCtrl.update);

module.exports = routes;