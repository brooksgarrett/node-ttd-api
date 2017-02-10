var mongoose = require('mongoose');

var Toneset = mongoose.model('Toneset', {
    toneID: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
    },
    aTone: {
        type: Number,
        required: true
    },
    bTone: {
        type: Number,
        required: true
    },
    aToneLength: {
        type: Number,
        required: true
    },
    bToneLength: {
        type: Number,
        required: true
    }
});

module.exports = {Toneset};