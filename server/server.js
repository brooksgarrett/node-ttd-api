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
const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/toneset', tonesetRoutes);

app.listen(port, () => {
    console.log(`Server up on ${port}`);
});

module.exports = {app};