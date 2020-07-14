const express = require('express');
const router = express.Router();

const authorize = require('../middlewares/authorize');

const { validateLogin, login } = require('./handlers/login');

const {
  validateInviteSignup,
  inviteSignup,
} = require('./handlers/inviteSignup');

const { refreshToken } = require('./handlers/refreshToken');

const { validateRevokeToken, revokeToken } = require('./handlers/revokeToken');

const {
  validateSignupInvitation,
  findSignupInvitation,
} = require('./handlers/checkSignupInvitation');

const { logout } = require('./handlers/logout');

const { validateSignup, signup } = require('./handlers/signup');

const {
  validateForgotPassword,
  forgotPassword,
} = require('./handlers/forgotPassword');

const {
  validateResetPassword,
  resetPassword,
} = require('./handlers/resetPassword');

const { validateRemoveUser, removeUser } = require('./handlers/removeUser');

const {
  validateRevokeAccess,
  revokeAccess,
} = require('./handlers/revokeAccess');

const { undoRevokeAccess } = require('./handlers/undoRevokeAccess');

const { fetchUsers } = require('./handlers/fetchUsers');

const roles = require('../constants/roles');

router.post('/login', validateLogin, login);

router.get('/logout', logout);

router.post(
  '/invite-signup',
  authorize(roles.Admin),
  validateInviteSignup,
  inviteSignup
);

router.post('/refresh-token', refreshToken);

router.post(
  '/revoke-token',
  authorize(roles.Default),
  validateRevokeToken,
  revokeToken
);

router.get(
  '/check-signup-invitation/:token?',
  validateSignupInvitation,
  findSignupInvitation
);

router.post('/signup', validateSignup, signup);

router.post('/forgot-password', validateForgotPassword, forgotPassword);

router.post('/reset-password', validateResetPassword, resetPassword);

router.delete(
  '/remove-user/:userId?',
  authorize(roles.Admin),
  validateRemoveUser,
  removeUser
);

router.get(
  '/revoke-access/:userId?',
  authorize(roles.Admin),
  validateRevokeAccess,
  revokeAccess
);

router.get(
  '/undo-revoke-access/:userId?',
  authorize(roles.Admin),
  validateRevokeAccess,
  undoRevokeAccess
);

router.get(
  '/fetch-users',
  authorize(roles.Admin),
  fetchUsers
);

module.exports = router;
