const Boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');
const { generateSchemas } = require('@medical-equipment-tracker/validator');

const validate = require('../../../middlewares/validate');
const generateJwtToken = require('../../../services/generateJwtToken');
const generateRefreshToken = require('../../../services/generateRefreshToken');
const models = require('../../../models');
const {
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} = require('../../../constants/cookies');
const getRequestLanguage = require('../../../services/getRequestLanguage');

module.exports = {
  validateLogin: async (req, res, next) => {
    const language = getRequestLanguage(req);
    const validator = generateSchemas(language);
    await validate(req, next, validator.loginSchema);
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;

    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return next(Boom.unauthorized('Invalid email or password'));
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      return next(Boom.unauthorized('Invalid email or password'));
    }

    if (user.isBlocked) {
      return next(Boom.unauthorized('Access revoked'));
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
