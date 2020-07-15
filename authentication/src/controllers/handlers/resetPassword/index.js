const path = require('path');
const Boom = require('@hapi/boom');
const validator = require('@medical-equipment-tracker/validator');
const bcrypt = require('bcryptjs');

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.production.local';
require('dotenv').config({
  path: path.join(__dirname, '../../../../../..', envFile),
});

const { validate } = require('../../../middlewares');
const {
  generateJwtToken,
  generateRefreshToken,
  logger,
} = require('../../../services');
const models = require('../../../models');
const { REFRESH_TOKEN_COOKIE } = require('../../../constants/cookies');
const { revokeAccess } = require('../logout');

module.exports = {
  validateResetPassword: async (req, res, next) => {
    await validate(req, next, validator.resetPasswordSchema);
  },

  resetPassword: async (req, res, next) => {
    const { password, token } = req.body;

    const forgotPassword = await models.ForgotPassword.findOne({
      include: [
        {
          model: models.User,
          as: 'User',
        },
      ],
      where: { token },
    });

    if (!forgotPassword) {
      return next(Boom.unauthorized('Invalid token'));
    }

    if (forgotPassword.used) {
      return next(Boom.badRequest('Reset link already used'));
    }

    if (forgotPassword.expiresAt < new Date()) {
      return next(Boom.badRequest('Expired reset link'));
    }

    if (forgotPassword.User && forgotPassword.User.isBlocked) {
      await revokeAccess(req, res);
      return next(Boom.unauthorized('Access revoked'));
    }

    let passwordHash = null;

    try {
      passwordHash = await bcrypt.hash(password, 10);
    } catch (error) {
      logger.error('resetPassword hashing error', error);
    }

    if (!passwordHash) {
      return next(Boom.badImplementation());
    }

    let user = null;
    const t = await models.sequelize.transaction();
    let transactionSuccessful = true;

    try {
      user = await models.User.update(
        { passwordHash, role: forgotPassword.User.role },
        {
          returning: true,
          where: { id: forgotPassword.User.id },
          transaction: t,
        }
      );

      await models.ForgotPassword.update(
        { used: true },
        { where: { id: forgotPassword.id }, transaction: t }
      );

      await t.commit();
    } catch (error) {
      logger.error('resetPassword transaction failed', error);

      await t.rollback();
      transactionSuccessful = false;
    }

    if (!transactionSuccessful || !user) {
      return next(Boom.badImplementation());
    }

    const jwtToken = generateJwtToken(user[1][0]);
    const jwtTokenExpiry = new Date(
      new Date().getTime() +
        process.env.AUTHENTICATION_JWT_TOKEN_EXPIRES * 60 * 1000
    );

    const refreshToken = await generateRefreshToken(user[1][0], req.ip);

    if (!refreshToken) {
      return next(Boom.badImplementation());
    }

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken.token, {
      maxAge: process.env.AUTHENTICATION_REFRESH_TOKEN_EXPIRES * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({
      jwtToken,
      jwtTokenExpiry,
      refreshToken,
    });
  },
};
