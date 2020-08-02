const Boom = require('@hapi/boom');
const { generateSchemas } = require('@medical-equipment-tracker/validator');
const bcrypt = require('bcryptjs');
const { htmlEscape } = require('escape-goat');

const { validate } = require('../../../middlewares');
const generateRefreshToken = require('../../../services/generateRefreshToken');
const generateJwtToken = require('../../../services/generateJwtToken');
const getRequestLanguage = require('../../../services/getRequestLanguage');
const logger = require('../../../services/logger');
const models = require('../../../models');
const {
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} = require('../../../constants/cookies');
const { revokeAccess } = require('../logout');

module.exports = {
  validateResetPassword: async (req, res, next) => {
    const language = getRequestLanguage(req);
    const validator = generateSchemas(language);
    await validate(req, next, validator.resetPasswordSchema);
  },

  resetPassword: async (req, res, next) => {
    const { password } = req.body;
    const token = htmlEscape(req.body.token);

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
      logger.error('[API] resetPassword hashing error', error);
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
      logger.error('[API] resetPassword transaction failed', error);

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

    res.cookie(
      REFRESH_TOKEN_COOKIE,
      refreshToken.token,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    res.json({
      jwtToken,
      jwtTokenExpiry,
      refreshToken,
    });
  },
};
