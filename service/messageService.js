var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var q = require('q');
var Promise = require("bluebird");
var ref = require('./connection').ref;

var transport = nodemailer.createTransport(mandrillTransport({
    auth: {
        apiKey: "HIC2DMI5pHsLStkER4qwRg"
    }
}));


var messageService = function() {};


messageService.prototype.sendMessage = function(token, data, cb) {
    var messageData = data
    var deferred = q.defer();
    var addresses = [];
    var arr = [];

    var emails = [];
    var pushNotifications = [];
    var counter = 0;

    if (data.eventType == "email") {
        for (var i = 0; i < data.emails.length; i++) {
            emails.push(new Promise(function(resolve, reject) {
                transport.sendMail({
                        from: data.sender,
                        to: data.emails[counter],
                        subject: data.subject,
                        html: data.text
                    },
                    function(err, info) {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            console.log(info);
                            resolve("Success!");

                        }
                    });
                counter++;
            }));
        }
        Promise.settle(emails).then(function(data) {
            saveLogMessage(messageData, cb);
            var aaa = 7777;
        });
    } else {
        if (data.eventType == "push") {
            for (var i = 0; i < data.deviceIds.length; i++) {
                pushNotifications.push(
                    new Promise(function(resolve, reject) {
                        request({
                            method: 'POST',
                            url: "https://tasktilldone.appspot.com/api/v1/message/send",
                            body: {
                                type: 'chat',
                                path: '#/app/' + data.path,
                                receiverId: data.deviceIds[counter],
                                params: [
                                    data.text,
                                    data.subject
                                ],
                                sendPush: true
                            },
                            json: true,
                        }, function(error, info) {
                            if (error) {
                                console.error(err);
                                reject(err);
                            } else {
                                console.log(info);
                                resolve("Success!");
                            }
                        });
                        counter++;
                    }));
            }
            Promise.settle(pushNotifications).then(function(data) {
                saveLogMessage(messageData, cb);

            });
        }
    }

};


var saveLogMessage = function(data, logCb) {
    var logArr = [];

    for (var i = 0; i < data.userIds.length; i++) {
        logObj = {
            desc: data.text,
            subject: data.subject,
            eventType: data.eventType,
            timestamp: data.timestamp,
            timestampStr: data.timestampStr,
            uid: data.userIds[i],
            uuid: uuid.v4()

        };
        logArr.push(logObj);
    }


    var arr = [];
    for (var i = 0; i < logArr.length; i++) {
        arr.push(
            ref.child("log/" + logArr[i].uuid)
            .set(logArr[i], function(err) {
                if (err) {
                    deffered.reject(err);

                } else {
                    deffered.resolve("Success!");
                }
            })
        );
    }
    q.all(arr).then(function(data) {
        logCb(null, data);
    });

};
messageService.prototype.getDeviceid = function(token, cb) {
    ref.auth(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Login Succeeded!", authData);
            ref.child("deviceid").once("value", function(snap) {
                var respFireBase = snap.val();
                cb(null, respFireBase);
            }, function(err) {
                cb(err, null);
            });
        }
    });
};


module.exports = new messageService();
