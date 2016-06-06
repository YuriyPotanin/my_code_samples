var client = require('./connection').client;
var ref = require('./connection').ref;
var async = require('async');

function createOrUpdateTaskIndex(task, id, cb) {
    var options = {};
    if (id) {
        otions = {
            _index: "app",
            _type: "tasks",
            _id: id,
        };
    } else {
        otions = {
            _index: "app",
            _type: "tasks",
            _id: null,
        };
    }

    client.index(otions, task,
        function(err, resp) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, resp);
            }
        });
}
var serviceTask = function() {};

serviceTask.prototype.getTasks = function(token, cb) {
    var valInElastic = [];

    client.search({
        _index: 'app',
        _type: "tasks"
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
                ref.child("tasks").once("value", function(snap) {
                    var respFireBaseValue = snap.val();
                    for (var key in respFireBaseValue) {
                        for (var i = 0; i < valInElastic.length; i++) {
                            if (valInElastic[i]._source.taskId == key) {
                                respFireBaseValue[key].es = valInElastic[i]._source;
                                respFireBaseValue[key].es.esId = valInElastic[i]._id;

                            }
                        }
                    }
                    cb(null, respFireBaseValue);
                }, function(err) {
                    cb(err, null);
                });
            }
        });
    });
};

serviceTask.prototype.getTask = function(token, fbId, cb) {
    var serchItem = fbId;

    var self = this;

    client.search({
            _index: "app",
            _type: "tasks",
        }, {
            query: {
                query_string: {
                    default_field: "tasks",
                    query: serchItem
                }
            }
        },
        function(error, resp) {
            if (error || resp.hits.hits.length == 0) {
                cb(error);
                console.log("es", "err");
            } else {
                ref.authWithCustomToken(token, function(autherror, authData) {
                    if (autherror) {
                        console.log("Login Failed!", autherror);
                    } else {
                        ref.child("tasks/" + fbId)
                            .once('value', function(data) {
                                var imgRequestArr = [];
                                var response;

                                response = self.onValueReceived(data, resp, imgRequestArr);                                

                                async.parallel(imgRequestArr, function(err, asyncResp) {
                                    console.log(err, asyncResp);
                                    response.img = [];
                                    for (var i = 0; i < asyncResp.length; i++) {
                                        response.img.push(JSON.parse(asyncResp[i].body));
                                    }
                                    cb(null, response);
                                });



                            }, function(err) {
                                cb(err);
                            });
                    }
                });
            }
        });
};

serviceTask.prototype.onValueReceived = function(data, resp, imgRequestArr) {

    var response = data.val();
    response.es = resp.hits.hits[0]._source;
    response.es.esId = resp.hits.hits[0]._id;
    var counter = 0;
    if (response.files) {
        for (var i = 0; i < response.files.length; i++) {
            imgRequestArr.push(function(acyncCb) {
                    request({
                        method: "POST",
                        form: {
                            filename: response.files[counter].path
                        }
                    }, function(err, result) {
                        acyncCb(null, result);
                    });
                    counter++;
                }

            );

        }
    }
    return response;
};

serviceTask.prototype.getTasksOffers = function(token, taskId, cb) {

    ref.auth(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Login Succeeded!", authData);
            ref.child("offers")
                .orderByChild('taskId')
                .startAt(taskId)
                .endAt(taskId)
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

serviceTask.prototype.updateTask = function(token, task, cb) {
    var fdId = task.fbId;
    var esObj = task.es;
    delete task.es;
    delete task.fbId;
    var postedByIdForQuery = task.postedBy.split('@').join('');
    
    var saveFB = {
        amount: task.amount,
        assignedDate: task.assignedDate,
        assigneeId: task.assigneeId,
        category: task.category,
        currency: task.currency,
        deletedDate: task.deletedDate,
        description: task.description,
        dueDate: task.dueDate,
        duration: task.duration,
        file: task.file,
        isDeleted: task.isDeleted,
        files: task.files,
        outsourced: task.outsourced,
        outsourcedDate: task.outsourcedDate,
        owner: task.owner,
        postedBy: task.postedBy,
        postedDate: task.postedDate,
        purchaseType: task.purchaseType,
        invitedList: task.invitedList,
        startDate: task.startDate,
        startDateType: task.startDateType,
        status: task.status,
        statusChangedBy: task.statusChangedBy,
        statusChangedByName: task.statusChangedByName,
        statusChangedDate: task.statusChangedDate,
        tags: task.tags,
        title: task.title,
        type: task.type
    };
    
    var saveES = {

        taskId: fdId,
        postedByIdForQuery: postedByIdForQuery,
        postedByName: esObj.postedByName,
        posteduserId: task.postedBy,
        title: task.title,
        description: task.description,
        currency: task.currency,
        amount: task.amount,
        startDate: task.startDate,
        dueDate: task.dueDate,
        status: task.status,
        outsourced: task.outsourced,
        posteddate: task.postedDate,
        tags: task.tags,
        statusChangedDate: task.statusChangedDate,
        outsourcedDate: task.outsourcedDate,
        purchaseType: task.purchaseType,
        startDateType: task.startDateType,
        duration: task.duration,
        invitedList: task.invitedList,
        category: task.category,
        statusChangedBy: task.statusChangedBy,
        statusChangedByName: task.statusChangedByName,
        file: task.file,
        files: task.files,
        isDeleted: task.isDeleted,
        deletedDate: task.deletedDate,
        type: task.type,
        owner: task.owner,
        ownerIdForQuery: task.ownerIdForQuery,
        assigneeId: task.assigneeId,
        assigneeIdForQuery: "",
        dateAssigned: task.assignedDate
    };


    ref.authWithCustomToken(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            ref
                .child("tasks/" + fdId)
                .set(saveFB, function(error) {
                    if (error) {
                        cb(error, null);
                        console.log('Synchronization failed');
                    } else {
                        createOrUpdateTaskIndex(saveES, esObj.esId, function(err, resp) {
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




module.exports = new serviceTask();
