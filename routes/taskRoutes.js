var taskService = require('../service/taskService');

module.exports = function(app) {

    app.get('/gettasks/:token', function(req, res, next) {
        taskService.getTasks(req.params.token, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });


    app.get('/gettask/:token/:fbId', function(req, res, next) {
        taskService.getTask(req.params.token, req.params.fbId, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });

    app.post('/updatetask/:token', function(req, res, next) {
        taskService.udateTask(req.params.token, req.body, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });

    app.get('/getTasksOffers/:token/:taskId', function(req, res, next) {
        taskService.getTasksOffers(req.params.token, req.params.taskId, function(err, response) {
            if (err) {
                res.send(err);
            } else {
                res.send(response);
            }

        });
    });
};
