const express = require('express');
const router = express.Router();
const { roles } = require('@medical-equipment-tracker/validator');

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

const { fetchUser } = require('./handlers/fetchUser');

const { updateUser, validateUpdateUser } = require('./handlers/updateUser');

const {
  validateChangePassword,
  changePassword,
} = require('./handlers/changePassword');

router.post('/login', validateLogin, login);

router.get('/logout', logout);

router.post(
  '/invite-signup',
  authorize(roles.Admin),
  validateInviteSignup,
  inviteSignup
);

router.post('/refresh-token', refreshToken);

router.put(
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

router.put('/reset-password', validateResetPassword, resetPassword);

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

router.get('/fetch-users', authorize(roles.Admin), fetchUsers);

router.get(
  '/fetch-user/:userId?',
  authorize(roles.Default),
  validateRevokeAccess,
  fetchUser
);

router.put(
  '/update-user/:userId?',
  authorize(roles.Default),
  validateUpdateUser,
  updateUser
);

router.put(
  '/change-password/:userId',
  authorize(roles.Default),
  validateRevokeAccess,
  validateChangePassword,
  changePassword
);

module.exports = router;
