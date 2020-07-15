const path = require('path');
const validator = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');

require('dotenv').config({
  path: path.join(__dirname, '../../../../../..', `.env.${process.env.NODE_ENV}.local`),
});

const { validate } = require('../../../middlewares');
const {
  generateJwtToken,
  generateRefreshToken,
  logger,
} = require('../../../services');
const models = require('../../../models');
const { REFRESH_TOKEN_COOKIE } = require('../../../constants/cookies');
const { roles } = validator;

module.exports = {
  validateSignup: async (req, res, next) => {
    await validate(req, next, validator.userSchema);
  },

  signup: async (req, res, next) => {
    const { firstName, lastName, email, password, token } = req.body;

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
      logger.error('signup hashing error', error);
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
      logger.error('signup transaction failed', error)

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
