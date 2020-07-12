const validator = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const pick = require('lodash.pick');

const validate = require('../../middlewares/validate');
const models = require('../../models');

module.exports = {
  validateSigninInvitation: async (req, res, next) => {
    await validate(req, next, validator.revokeTokenSchema, true);
  },

  findSigninInvitation: async (req, res, next) => {
    const { token } = req.params;

    const signinInvitation = await models.SignInInvitation.findOne({
      where: { token },
    });

    if (!signinInvitation) {
      return next(Boom.badRequest('Invalid sign up invitation'));
    }

    if (signinInvitation.accountCreated) {
      return next(Boom.badRequest('Account already exists for this email'));
    }

    let setOpened = null;

    try {
      setOpened = await models.SignInInvitation.update(
        { isOpened: true },
        { where: { id: signinInvitation.id } }
      );
    } catch (error) {
      console.log('checkSigninInvitation error');
      console.log(error);
    }

    if (!setOpened) {
      return next(Boom.badImplementation());
    }

    res.json({
      result: 'Valid sign up invitation',
      payload: pick(signinInvitation, ['email', 'token', 'name']),
    });
  },
};
