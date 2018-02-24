var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Client = require('./../models/client');
var Provider = require('./../models/provider');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var _createClient = function (req, res, user) {
    var client = new Client();

    client.name = req.body.name;
    client.email = req.body.email;
    client.save(function (err) {
        _generateJwtResponse(res, user);
    });
}

var _createProvider = function (req, res, user) {
    var provider = new Provider();

    provider.name = req.body.name;
    provider.email = req.body.email;
    provider.save(function (err) {
        _generateJwtResponse(res, user);
    });
}

var _generateJwtResponse = function (res, user) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
        "token": token
    });
}


module.exports.register = function (req, res) {

    var user = new User();

    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;
    user.setPassword(req.body.password);

    User.findOne({
        email: req.body.email
    }, function (err, _user) {
        if (_user) {
            res.status(409).json({
                "message": "Existing User"
            });
        } else {
            user.save(function (err) {
                if (req.body.role === 'provider') {
                    _createProvider(req, res, user);
                } else {
                    _createClient(req, res, user);
                }
            });
        }
    })
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
