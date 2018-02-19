var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Client = require('./../models/client');
var Provider = require('./../models/provider');;

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) {

    var user = new User();
    var client = new Client();

    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    client.name = req.body.name;
    client.email = req.body.email;

    user.save(function (err) {
        client.save();
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
            "token": token
        });
    });
};

module.exports.login = function (req, res) {

    passport.authenticate('local', function (err, user, info) {
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);

};
