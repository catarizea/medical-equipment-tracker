const { generateSchemas } = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const { v4: uuidv4 } = require('uuid');
const { htmlEscape } = require('escape-goat');

const { validate } = require('../../../middlewares');
const models = require('../../../models');
const { revokeAccess } = require('../logout');
const logger = require('../../../services/logger');
const { publish } = require('@medical-equipment-tracker/message-broker');
const getRequestLanguage = require('../../../services/getRequestLanguage');

module.exports = {
  validateForgotPassword: async (req, res, next) => {
    const language = getRequestLanguage(req);
    const validator = generateSchemas(language);
    await validate(req, next, validator.forgotPasswordSchema);
  },

  forgotPassword: async (req, res, next) => {
    const email = htmlEscape(req.body.email);

    const message =
      'If this account exists you will get a password reset email';

    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return res.json({
        result: message,
      });
    }

    if (user.isBlocked) {
      await revokeAccess(req, res);
      return next(Boom.unauthorized('Access revoked'));
    }

    const newForgotPassword = {
      token: uuidv4(),
      expiresAt: new Date(
        Date.now() +
          process.env.AUTHENTICATION_FORGOT_PASSWORD_EXPIRES * 60 * 1000
      ),
      ip: req.ip,
      UserId: user.id,
      used: false,
    };

    let dbForgotPassword = null;

    try {
      dbForgotPassword = await models.ForgotPassword.create(newForgotPassword);
    } catch (error) {
      logger.error('[API] forgotPassword create error', error);
    }

    if (!dbForgotPassword) {
      return next(Boom.badImplementation());
    }

    let host = 'https://medical.equipment';

    if (process.env.NODE_ENV === 'development') {
      host = process.env.AUTHENTICATION_EXPRESS_ENDPOINT;
    }

    const renderVars = {
      host,
      token: dbForgotPassword.token,
      toName: user.fullName,
      fromName: 'Admin',
    };

    const emailSent = await publish(
      process.env.WORKER_MAILER_FORGOT_QUEUE,
      JSON.stringify({ to: user.email, renderVars })
    );

    if (!emailSent) {
      return next(Boom.badImplementation());
    }

    logger.info(`[API] forgot password email task published for ${user.email}`);

    res.json({ result: message });
  },
};
