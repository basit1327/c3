'use strict';

const
	express = require('express'),
	userProfileService = require('../../services/user/user_profile');

let router = express.Router();

router.post('/update', userProfileService.updateAccount);
router.get('/delete_own', userProfileService.deleteOwnAccount);

module.exports = router;
