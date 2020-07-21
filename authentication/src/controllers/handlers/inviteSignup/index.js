const validator = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const { v4: uuidv4 } = require('uuid');
const { htmlEscape } = require('escape-goat');
const { publish } = require('@medical-equipment-tracker/message-broker');

const { validate } = require('../../../middlewares');
const models = require('../../../models');
const logger = require('../../../services/logger');

module.exports = {
  validateInviteSignup: async (req, res, next) => {
    await validate(req, next, validator.inviteSignupSchema);
  },

  inviteSignup: async (req, res, next) => {
    const email = htmlEscape(req.body.email);
    const firstName = htmlEscape(req.body.firstName);
    const { user } = req;

    const invitee = await models.User.findOne({ where: { email } });

    if (invitee) {
      let errorMessage = 'Account already exists for this email';

      if (invitee.isBlocked) {
        errorMessage += '. Access revoked for this email';
      }
      
      return next(Boom.badRequest(errorMessage));
    }

    let signupInvitation = null;

    try {
      signupInvitation = await models.SignupInvitation.create({
        email,
        name: firstName,
        token: uuidv4(),
        UserId: user.id,
      });
    } catch (error) {
      logger.error('[API] inviteSignup error', error);
    }

    if (!signupInvitation) {
      return next(Boom.badImplementation());
    }

    let host = 'https://medical.equipment';

    if (process.env.NODE_ENV !== 'production') {
      host = process.env.AUTHENTICATION_EXPRESS_ENDPOINT;
    }

    const renderVars = {
      host,
      invitationId: signupInvitation.token,
      toName: firstName,
    };

    const emailSent = await publish(
      process.env.WORKER_MAILER_INVITE_QUEUE,
      JSON.stringify({ to: email, renderVars })
    );


    if (!emailSent) {
      return next(Boom.badImplementation());
    }

    logger.info(`[API] signup invite mail task published for ${email}`);

    res.json({ result: 'Invitation to signup sent' });
  },
};
