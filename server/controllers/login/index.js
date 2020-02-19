'use strict';

const
	express = require('express'),
	userAuthService = require('../../services/user/user_authentication');

let router = express.Router();

router.post('/login', userAuthService.userLogin);
router.post('/signup', userAuthService.userRegister);

module.exports = router;
