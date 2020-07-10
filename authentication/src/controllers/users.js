const express = require('express');
const router = express.Router();

const authorize = require('../middlewares/authorize');
const { validateLogin, login } = require('./handlers/login');
const {
  validateInviteSignin,
  inviteSignin,
} = require('./handlers/inviteSignin');
const { refreshToken } = require('./handlers/refreshToken');
const { validateRevokeToken, revokeToken } = require('./handlers/revokeToken');
const {
  validateSigninInvitation,
  findSigninInvitation,
} = require('./handlers/checkSigninInvitation');
const roles = require('../constants/roles');

// router.post('/signin', );
// router.post('/forgot-password', );
// router.post('/reset-password', );

router.post('/login', validateLogin, login);

router.post(
  '/invite-signin',
  authorize(roles.Admin),
  validateInviteSignin,
  inviteSignin
);

router.post('/refresh-token', refreshToken);

router.post(
  '/revoke-token',
  authorize(roles.Default),
  validateRevokeToken,
  revokeToken
);

router.get(
  '/check-signin-invitation/:token',
  validateSigninInvitation,
  findSigninInvitation
);

module.exports = router;
