'use strict';

const
	express = require('express'),
	apiController = require('../../controllers/api');

let router = express.Router();

router.use('/', apiController);

module.exports = router;
