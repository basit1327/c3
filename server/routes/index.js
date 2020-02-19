'use strict';

const auth = require('../services/auth'),
    apiRoute = require('./api'),
    loginRoute = require('../routes/login');

function init(server) {

    // supporting every casing in query parameters
    server.use(function (req, res, next) {
        for (var key in req.query) {
            req.query[key.toLowerCase()] = req.query[key];
        }
        for (var key in req.body) {
            req.body[key.toLowerCase()] = req.body[key];
        }
        next();
    });

    server.use('/', function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Authorization");
        next();
    });

    server.get('/', function (req, res) {
        res.send('|--- C3 SERVER ---|')
    });

    server.use('/api',auth.authenticateSession,apiRoute);
    server.use('/auth',loginRoute);

}

module.exports = {
    init: init
};
