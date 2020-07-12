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
const { logout } = require('./handlers/logout');
const { validateSignin, signin } = require('./handlers/signin');
const {
  validateForgotPassword,
  forgotPassword,
} = require('./handlers/forgotPassword');

const {
  validateResetPassword,
  resetPassword,
} = require('./handlers/resetPassword');

const roles = require('../constants/roles');

router.post('/login', validateLogin, login);

router.get('/logout', logout);

router.post(
  '/invite-signup',
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
  '/check-signup-invitation/:token',
  validateSigninInvitation,
  findSigninInvitation
);

router.post('/signup', validateSignin, signin);

router.post('/forgot-password', validateForgotPassword, forgotPassword);

router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;
