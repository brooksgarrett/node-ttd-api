const express = require('express');
var routes = express.Router();

const {authenticate} = require('../middleware/authenticate');
const TonesetCtrl = require('../controllers/toneset');

routes.post('/', authenticate, TonesetCtrl.create);
routes.get('/', authenticate, TonesetCtrl.list);
routes.get('/:id', authenticate, TonesetCtrl.fetchOne);
routes.delete('/:id', authenticate, TonesetCtrl.delete);
routes.patch('/:id', authenticate, TonesetCtrl.update);
routes.get('/subscriptions/:id', authenticate, TonesetCtrl.listSubscriptions);

module.exports = routes;