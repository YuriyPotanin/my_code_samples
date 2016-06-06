var client = require('./connection').client;
var ref = require('./connection').ref;



var paymentsSerice = function() {};




paymentsSerice.prototype.getPayments = function(token, cb) {

    ref.auth(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Login Succeeded!", authData);
            ref.child("payments").once("value", function(snap) {
                var respFireBaseValue = snap.val();
                cb(null, respFireBaseValue);
            }, function(err) {
                cb(err, null);
            });
        }
    });

};

paymentsSerice.prototype.getPayment = function(token, paymentId, cb) {

    ref.auth(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Login Succeeded!", authData);
            ref.child("payments/" + paymentId)
                .once("value", function(snap) {
                    var respFireBaseValue = snap.val();
                    cb(null, respFireBaseValue);
                }, function(err) {
                    cb(err, null);
                });
        }
    });

};
module.exports = new paymentsSerice();
