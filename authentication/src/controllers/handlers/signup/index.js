const { generateSchemas, roles } = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');
const { htmlEscape } = require('escape-goat');

const { validate } = require('../../../middlewares');
const generateRefreshToken = require('../../../services/generateRefreshToken');
const generateJwtToken = require('../../../services/generateJwtToken');
const logger = require('../../../services/logger');
const getRequestLanguage = require('../../../services/getRequestLanguage');
const models = require('../../../models');
const {
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} = require('../../../constants/cookies');

module.exports = {
  validateSignup: async (req, res, next) => {
    const language = getRequestLanguage(req);
    const validator = generateSchemas(language);
    await validate(req, next, validator.userSchema);
  },

  signup: async (req, res, next) => {
    const { password } = req.body;
    const firstName = htmlEscape(req.body.firstName);
    const lastName = htmlEscape(req.body.lastName);
    const email = htmlEscape(req.body.email);
    const token = htmlEscape(req.body.token);
  
    const signupInvitation = await models.SignupInvitation.findOne({
      where: { token },
    });

    if (!signupInvitation || signupInvitation.email !== email) {
      return next(Boom.badRequest('Invalid sign up invitation'));
    }

    let passwordHash = null;

    try {
      passwordHash = await bcrypt.hash(password, 10);
    } catch (error) {
      logger.error('[API] signup hashing error', error);
    }

    if (!passwordHash) {
      return next(Boom.badImplementation());
    }

    const newUser = {
      firstName,
      lastName,
      email,
      passwordHash,
      role: [roles.Default],
    };

    const t = await models.sequelize.transaction();

    let transactionSuccessful = true;
    let user = null;

    try {
      user = await models.User.create(newUser, { transaction: t });

      await models.SignupInvitation.update(
        { isOpened: true, accountCreated: true },
        { where: { id: signupInvitation.id }, transaction: t }
      );

      await t.commit();
    } catch (error) {
      logger.error('[API] signup transaction failed', error);

      await t.rollback();
      transactionSuccessful = false;
    }

    if (!transactionSuccessful || !user) {
      return next(Boom.badImplementation());
    }

    const jwtToken = generateJwtToken(user);
    const jwtTokenExpiry = new Date(
      new Date().getTime() +
        process.env.AUTHENTICATION_JWT_TOKEN_EXPIRES * 60 * 1000
    );

    const refreshToken = await generateRefreshToken(user, req.ip);

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
