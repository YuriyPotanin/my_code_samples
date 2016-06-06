var uuid = require('node-uuid');
var request = require('request');
var async = require('async');

var client = require('./connection').client;
var ref = require('./connection').ref;

var q = require('q');


var deffered = q.defer();

function createOrUpdateUserIndex(user, id, cb) {
    var options = {};
    if (user.es) {
        otions = {
            _index: "tasktilldone",
            _type: "users",
            _id: id,
        };
    } else {
        otions = {
            _index: "tasktilldone",
            _type: "users",
            _id: null,
        };
    }

    client.index(otions, {
            name: user.name,
            email: user.user_email,
            id: user.fbId,
            pic_url: user.user_pic_url
        },
        function(err, resp) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, resp);
            }
        });
}


var serviceUser = function() {};

serviceUser.prototype.getUsers = function(token, cb) {
    var valInElastic = [];

    client.search({
        _index: 'tasktilldone',
        _type: "users"
    }, {
        size: 10000
    }, function(err, respElastic) {
        if (err) {
            console.log('err', err);
        } else {
            console.log('resp', respElastic);
            valInElastic = respElastic.hits.hits;
        }


        ref.auth(token, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Login Succeeded!", authData);
                ref.child("users").once("value", function(snap) {
                    var respFireBase = snap.val();
                    for (var key in respFireBase) {
                        for (var i = 0; i < valInElastic.length; i++) {
                            if (valInElastic[i]._source.id == key) {
                                respFireBase[key].es = valInElastic[i]._source;
                                respFireBase[key].es.esId = valInElastic[i]._id;

                            }
                        }
                    }
                    cb(null, respFireBase);
                }, function(err) {
                    cb(err, null);
                });
            }
        });
    });
};

serviceUser.prototype.updateUser = function(token, user, cb) {
    var fdId = user.fbId;
    var esObj = user.es;

    ref.authWithCustomToken(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            ref
                .child("users/" + user.fbId)
                .set(user, function(error) {
                    if (error) {
                        cb(error, null);
                        console.log('Synchronization failed');
                    } else {
                        createOrUpdateUserIndex(user, esObj.esId, function(err, resp) {
                            if (err) {

                                cb(err, null);

                            } else {
                                cb(null, 'Synchronization succeeded');
                                console.log('Synchronization succeeded');
                            }
                        });
                    }
                });
        }
    });
};

serviceUser.prototype.getUserPayments = function(token, stripe_user_id, cb) {
    ref.authWithCustomToken(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            ref.child("payments")
                .orderByChild('destination')
                .startAt(stripe_user_id)
                .endAt(stripe_user_id)
                .once("value", function(payments) {
                    response = payments.val();
                    cb(response);
                });


        }
    });
};


serviceUser.prototype.registration = function(mail, pass, cb) {
    ref.createUser({
        email: mail,
        password: pass
    }, function(error, userData) {
        if (error) {
            cb(error, null);
            console.log("Error creating user:", error);
        } else {
            cb(null, userData);
            console.log("Successfully created user account with uid:", userData.uid);
        }
    });
};

serviceUser.prototype.getUserFriends = function(token, userMail, cb) {
    ref.auth(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Login Succeeded!", authData);
            ref.child("friends")
                .once("value", function(snap) {
                    var respFireBaseValue = snap.val();


                    var deltaArr = [];
                    for (key in respFireBaseValue) {
                        if (respFireBaseValue[key].receiver == userMail) {
                            deltaArr.push(respFireBaseValue[key].sender);
                        }
                        if (respFireBaseValue[key].sender == userMail) {
                            deltaArr.push(respFireBaseValue[key].receiver);
                        }
                    }
                    var respArr = [];
                    for (var i = 0; i < deltaArr.length; i++) {
                        found = undefined;
                        for (var j = 0; j < respArr.length; j++) {
                            if (respArr[j] == deltaArr[i]) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            respArr.push(deltaArr[i]);
                        }
                    }



                    cb(null, respArr);
                }, function(err) {
                    console.log(err);
                    cb(err, null);
                });
        }
    });

};

serviceUser.prototype.getUserNotifications = function(token, userEmail, cb) {

    ref.auth(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Login Succeeded!", authData);
            ref.child("notifications")
                .orderByChild('idReceiver')
                .startAt(userEmail)
                .endAt(userEmail)
                .once("value", function(snap) {
                    var res = [];
                    var respFireBaseValue = snap.val();
                    for (var key in respFireBaseValue) {
                        res.push(respFireBaseValue[key])
                    }
                    cb(null, res);
                }, function(err) {
                    cb(err, null);
                });
        }
    });

};

serviceUser.prototype.getUserOffers = function(token, userEmail, cb) {

    ref.auth(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Login Succeeded!", authData);
            ref.child("offers")
                .orderByChild('userId')
                .startAt(userEmail)
                .endAt(userEmail)
                .once("value", function(snap) {
                    var res = [];
                    var respFireBaseValue = snap.val();
                    for (var key in respFireBaseValue) {
                        res.push(respFireBaseValue[key]);
                    }
                    cb(null, res);
                }, function(err) {
                    cb(err, null);
                });
        }
    });


};

module.exports = new serviceUser();
