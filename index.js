'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var userRoutes = require('./routes/userRoutes')(app);
var taskRoutes = require('./routes/taskRoutes')(app);
var messageRoutes = require('./routes/messageRoutes')(app);
var paymentsRoutes = require('./routes/paymentsRoutes')(app);

var server = require('http').createServer(app);

var port = process.env.PORT || 8888;

server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

app.use(bodyParser.json())
    .get('/', function(req, res, next) {
        res.sendFile(__dirname + '/public/index.html');
    })

.use(express.static(__dirname + '/public'));
