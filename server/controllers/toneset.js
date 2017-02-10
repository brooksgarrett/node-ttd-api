const _ = require('lodash');

const {Toneset} = require('../models/toneset');
const {User} = require('../models/user');

module.exports = {
create: (req, res) => {
    var toneset = new Toneset({
        toneID: req.body.toneID,
        description: req.body.description,
        aTone: req.body.aTone,
        bTone: req.body.aTone,
        aToneLength: req.body.aToneLength,
        bToneLength: req.body.bToneLength,
    });

    toneset.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
},

list: (req, res) => {
    Toneset.find({}).then((tonesets) => {
        res.send({tonesets});
    }, (e) => {
        res.status(400);
        res.send(e);
    });
},

listSubscriptions: (req, res) => {
    console.log(req.params.id);
    User.find({"subscriptions._toneset": req.params.id}).then((users) => {
        res.send({users});
    }, (e) => {
        res.status(400);
        res.send(e);
    });
},

fetchOne: (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400)
            .send({error: `${id} is not valid`});
    }
    Toneset.findOne({
        _id: id
        }).then((toneset) => {
        if (!toneset) {
            return res.status(404).send();
        }
        res.send({toneset});
    }, (e) => {
        res.status(400).send(e);
    });
},

delete: (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(400)
            .send({error: `${id} is not valid`});
    }
    Toneset.findOneAndRemove({
        _id: id
    }).then((toneset) => {
        if (!toneset) {
            return res.status(404).send();
        }
        res.send({toneset});
    }, (e) => {
        res.status(400).send(e);
    });
},

update: (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, [
        'toneID',
        'description',
        'aTone',
        'bTone',
        'aToneLength',
        'bToneLength'
    ]);

    if (!ObjectID.isValid(id)) {
        return res.status(400)
            .send({error: `${id} is not valid`});
    }

    Toneset.findOneAndUpdate({_id: id}, {
        $set: body
    }, {
        new: true
    }).then((toneset) => {
        if (!toneset) {
            return res.status(404).send();
        }

        res.send({toneset});
    }).catch((e) => {
        res.status(400).send();
    });

}
}