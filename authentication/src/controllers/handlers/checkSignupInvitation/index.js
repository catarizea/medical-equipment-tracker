const { generateSchemas } = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const pick = require('lodash.pick');

const { validate } = require('../../../middlewares');
const models = require('../../../models');
const logger = require('../../../services/logger');
const { htmlEscape } = require('escape-goat');
const getRequestLanguage = require('../../../services/getRequestLanguage');

module.exports = {
  validateSignupInvitation: async (req, res, next) => {
    const language = getRequestLanguage(req);
    const validator = generateSchemas(language);
    await validate(req, next, validator.revokeTokenSchema, true);
  },

  findSignupInvitation: async (req, res, next) => {
    const token = htmlEscape(req.params.token);

    const signupInvitation = await models.SignupInvitation.findOne({
      where: { token },
    });

    if (!signupInvitation) {
      return next(Boom.badRequest('Invalid sign up invitation'));
    }

    if (signupInvitation.accountCreated) {
      return next(Boom.badRequest('Account already exists for this email'));
    }

    let setOpened = null;

    try {
      setOpened = await models.SignupInvitation.update(
        { isOpened: true },
        { where: { id: signupInvitation.id } }
      );
    } catch (error) {
      logger.error('[API] checkSignupInvitation error', error);
    }

    if (!setOpened) {
      return next(Boom.badImplementation());
    }

    res.json({
      result: 'Valid sign up invitation',
      payload: pick(signupInvitation, ['email', 'token', 'name']),
    });
  },
};
