'use strict';

const
	express = require('express'),
	loginController = require('../../controllers/login');

let router = express.Router();

router.use('/', loginController);

module.exports = router;
