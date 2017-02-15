const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {User} = require('../models/user');
const {Toneset} = require('../models/toneset');

module.exports ={
create: (req, res) => {
    var body = _.pick(req.body, [
        'email', 
        'password',
        'phone',
        'preAlert'
    ]);

    var user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            res.header('x-auth', token).send(user);
        }).catch((e) => {
            res.status(400);
            res.send(e);
        });
},

login: (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        token = user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch(() => {
        res.status(401).send();
    });
},

logout: (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });

},
update: (req, res) => {
    var id = req.user._id;
    var body = _.pick(req.body, [
        'email',
        'password',
        'phone',
        'carrier',
        'subscriptions',
        'preAlert'
    ]);

    if (!ObjectID.isValid(id)) {
        return res.status(400)
            .send({error: `${id} is not valid`});
    }

    User.findOneAndUpdate({_id: id}, {
        $set: body
    }, {
        new: true
    }).then((user) => {
        if (!user) {
            return res.status(404).send();
        }

        res.send({user});
    }).catch((e) => {
        res.status(400).send();
    });
},

subscribe: (req, res) => {
    var userID = req.user._id;
    var toneID = req.params.toneset;
    var {subType} = req.body;

    Toneset.findOne({_id: toneID}).then((toneset) => {
        if (!toneset) {
            res.status(404).send();
        }

        User.findOne({_id: userID}).then((user) => {
            if (!user) {
                return res.status(404).send();
            }

            var existingSub = user.subscriptions.filter((sub) => 
                (sub.subType === subType && sub._toneset.toHexString() === toneID));
            if (existingSub.length === 0) {
                User.findOneAndUpdate({_id: userID}, {
                    $push: {
                        subscriptions: {
                            _toneset: toneID,
                            subType
                        }
                    }                
                }, {
                        new: true
                }).then((user) => {
                    if (!user) {
                        return res.status(404).send();
                    }

                    res.send({user});
                });
            } else {
                res.send({user});
            }
        }).catch((e) => {
            res.status(400).send();
        });
    });
},

unsubscribe: (req, res) => {
    var userID = req.user._id;
    var toneID = req.params.toneset;
    var {subType} = req.body;

    Toneset.findOne({_id: toneID}).then((toneset) => {
        if (!toneset) {
            res.status(404).send();
        }

        User.findOne({
            _id: userID, 
            'subscriptions._toneset': toneID, 
            'subscriptions.subType': subType
        }).then((user) => {
            if (!user) {
                return res.status(404).send();
            }

            var newSub = user.subscriptions.filter((sub) => 
                !(sub.subType === subType && sub._toneset.toHexString() === toneID));
            user.subscriptions = newSub;
            user.save().then((user) => res.send({user}));
        }).catch((e) => {
            res.status(400).send();
        });
    });
},

info: (req, res) => {
    res.send(req.user);
}

}