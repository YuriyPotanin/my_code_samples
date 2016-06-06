var userService = require('../service/usersService.js');

module.exports = function(app) {
    app.post('/registration', function(req, res, next) {
        service.registration(req.body.email, req.body.secret, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }
        });
    });
    app.post('/login', function(req, res, next) {
        service.login(req.body.email, req.body.secret, function(err, response) {
            if (err) {
                res.status(403).send(err);
            } else {
                res.send(response);
            }
        });
    });
    app.get('/getusers/:token', function(req, res, next) {
        userService.getUsers(req.params.token, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });

    app.post('/updateuser/:token', function(req, res, next) {
        userService.updateUser(req.params.token, req.body, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });
    app.get('/getuser/:token/:fbId', function(req, res, next) {
        userService.getUser(req.params.token, req.params.fbId, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });


    app.get('/getuserfriends/:token/:userMail', function(req, res, next) {
        userService.getUserFriends(req.params.token, req.params.userMail, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });
    app.get('/getUserOffers/:token/:userMail', function(req, res, next) {
        userService.getUserOffers(req.params.token, req.params.userMail, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });

    app.get('/getUserNotifications/:token/:userEmail', function(req, res, next) {
        userService.getUserNotifications(req.params.token, req.params.userEmail, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });
};
