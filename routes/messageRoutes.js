var messageService = require('../service/messageService');

module.exports = function(app) {


    app.get('/deviceid/:token', function(req, res, next) {
        messageService.getDeviceid(req.params.token, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });

    app.post('/sendMessage/:token', function(req, res, next) {
        messageService.sendMessage(req.params.token, req.body, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });

};
