const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var subscriptionSchema = new mongoose.Schema({ 
    _toneset: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        //unique: true
    },
    subType: {
        type: String,
        validator: (v) => (v === "phone" || v === 'email'),
    }
});

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
            },
    },
    phone: {
        type: String,
        required: false,
        minlength: 10,
        trim: true,
        validate: {
            validator: (v) => {
                return validator.isMobilePhone(v, 'en-US');
            },
            message: '{VALUE} is not a valid phone'
        }
    },
    carrier: {
        type: String,
        required: false,
        trim: true
    },
    preAlert: {
        type: Boolean,
        default: false
    },
    subscriptions: [subscriptionSchema],
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            requried: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'phone', 'carrier', 'subscriptions']);

};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';

    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
    user.tokens.push({access, token});
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
}

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded = undefined;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
        });
};

UserSchema.statics.findByCredentials = function (email, password) {
    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password).then((result) => {
                if (result) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
}

UserSchema.pre('save', function (next) {
    var user =  this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else{
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
