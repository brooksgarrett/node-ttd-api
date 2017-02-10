const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {User} = require('../models/user');

module.exports ={
create: (req, res) => {
    var body = _.pick(req.body, [
        'email', 
        'password',
        'phone'
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
        'subscriptions'
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

info: (req, res) => {
    res.send(req.user);
}

}