'use strict';
/**
 * Dependencies of This Application
 */
const
    express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes');


let server = express(),
    create,
    start
    ;

create = function (config) {
    // Server settings
    server.set('env', config.env);
    server.set('port', config.serverPort);
    server.set('hostname', config.hostname);

    // Returns middleware that parses json
    server.use(bodyParser.json());

    // setup public directory
    server.use(express.static('public'));

    // Set up routes
    routes.init(server);
};

start = function () {
    let hostname = server.get('hostname'),
        port = server.get('port');

    server.listen(port, function () {
        console.log(`Starting the Http instance of C3 Server at: ${hostname} : ${port}`);
        console.log("Http instance of C3 Server is Live!!!");
    });
};

module.exports ={
    create,
    start
};
