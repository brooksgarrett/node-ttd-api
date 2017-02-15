// Do config based on environment
require('../config/config');

// Package imports
const express = require('express');
const bodyParser = require('body-parser');

// Local imports
var mongoose = require('./db/mongoose');
const userRoutes = require('./routes/user');
const tonesetRoutes = require('./routes/toneset');

var app = express();
var morgan = require('morgan');
const port = process.env.PORT;

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/toneset', tonesetRoutes);
app.use('/app', express.static(__dirname + '/public', {fallthrough: false}));

app.listen(port, () => {
    console.log(`Server up on ${port}`);
});

module.exports = {app};