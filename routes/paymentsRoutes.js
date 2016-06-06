var paymentsService = require('../service/paymentsService');

module.exports = function(app) {

    app.get('/getpayments/:token', function(req, res, next) {
        paymentsService.getPayments(req.params.token, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });
    app.get('/getpayment/:token/:paymentId', function(req, res, next) {
        paymentsService.getPayment(req.params.token, req.params.paymentId, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });


};
