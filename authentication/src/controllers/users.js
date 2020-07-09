const express = require('express');
const router = express.Router();

const authorize = require('../middlewares/authorize');
const { validateLogin, login } = require('./handlers/login');
const { inviteSignin } = require('./handlers/inviteSignin');
const { refreshToken } = require('./handlers/refreshToken');
const roles = require('../constants/roles');

// router.get('/signin-invited/:token', );
// router.post('/signin', );
// router.post('/forgot-password', );
// router.post('/revoke-token', authorize(roles.Admin));

router.post('/login', validateLogin, login);
router.post('/invite-signin', authorize(roles.Admin), inviteSignin);
router.post('/refresh-token', refreshToken);

module.exports = router;