const path = require('path');
const validator = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.production.local';
require('dotenv').config({
  path: path.join(__dirname, '../../../..', envFile),
});

const validate = require('../../middlewares/validate');
const generateJwtToken = require('../../services/generateJwtToken');
const generateRefreshToken = require('../../services/generateRefreshToken');
const models = require('../../models');
const { REFRESH_TOKEN_COOKIE } = require('../../constants/cookies');
const roles = require('../../constants/roles');

module.exports = {
  validateSignin: async (req, res, next) => {
    await validate(req, next, validator.userSchema);
  },

  signin: async (req, res, next) => {
    const { firstName, lastName, email, password, token } = req.body;

    const signinInvitation = await models.SignInInvitation.findOne({
      where: { token },
    });

    if (!signinInvitation || signinInvitation.email !== email) {
      return next(Boom.badRequest('Invalid sign in invitation'));
    }

    let passwordHash = null;

    try {
      passwordHash = await bcrypt.hash(password, 10);
    } catch (error) {
      console.log('signin hashing error');
      console.error(error);
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

    let user = null;

    try {
      user = await models.User.create(newUser);
    } catch (error) {
      console.log('signing creating error');
      console.log(error);
    }

    if (!user) {
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
