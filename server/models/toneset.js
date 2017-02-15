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
        default: 500
    },
    bToneLength: {
        type: Number,
        default: 1000
    }
});

module.exports = {Toneset};