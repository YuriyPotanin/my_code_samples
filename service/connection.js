var es = require('es');
var firebase = require('firebase');


var connection = {};

connection.client = new es.createClient({
    server: {
        hostname: 'birch-3722045.eu-west-1.bonsai.io',
        auth: 'wcaq68fr:jd7rw8qv41mdl0qs'
    }
});
connection.ref = new firebase("https://tasktilldone-test.firebaseio.com");

module.exports = connection;
