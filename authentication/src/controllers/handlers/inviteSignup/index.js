const path = require('path');
const validator = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const mailer = require('@medical-equipment-tracker/mailer');
const { v4: uuidv4 } = require('uuid');

const validate = require('../../../middlewares/validate');
const models = require('../../../models');
const renderTextMessage = require('../../../utils/emailTemplates/inviteSignup/textTemplate');
const renderHtmlMessage = require('../../../utils/emailTemplates/inviteSignup/htmlTemplate');

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.production.local';
require('dotenv').config({
  path: path.join(__dirname, '../../../../..', envFile),
});

module.exports = {
  validateInviteSignup: async (req, res, next) => {
    await validate(req, next, validator.inviteSignupSchema);
  },

  inviteSignup: async (req, res, next) => {
    const { email, firstName } = req.body;
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
      console.log('inviteSignup error');
      console.log(error);
    }

    if (!signupInvitation) {
      return next(Boom.badImplementation());
    }

    let host = 'https://medical.equipment';

    if (process.env.NODE_ENV === 'development') {
      host = process.env.AUTHENTICATION_EXPRESS_ENDPOINT;
    }

    const renderVars = {
      host,
      invitationId: signupInvitation.token,
      toName: firstName,
    };

    let emailSent = null;

    try {
      emailSent = await mailer.sendMail({
        from: 'noreply@medical.equipment',
        to: email,
        subject: 'Invitation to create an account on medical.equipment',
        text: renderTextMessage(renderVars),
        html: renderHtmlMessage(renderVars),
      });
    } catch (error) {
      console.log('inviteSignup email error');
      console.log(error);
    }

    if (!emailSent) {
      return next(Boom.badImplementation());
    }

    console.log(JSON.stringify(emailSent, null, 2));

    res.json({ result: 'Invitation to signup sent' });
  },
};
