const path = require('path');
const validator = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const get = require('lodash.get');
const mailer = require('@medical-equipment-tracker/mailer');

const validate = require('../../middlewares/validate');
const models = require('../../models');
const { KEY } = require('../../constants/claims');
const renderTextMessage = require('../../utils/emailTemplates/textTemplate');
const renderHtmlMessage = require('../../utils/emailTemplates/htmlTemplate');

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.production.local';
require('dotenv').config({
  path: path.join(__dirname, '../../../..', envFile),
});

module.exports = {
  validateInviteSignin: async (req, res, next) => {
    await validate(req, next, validator.inviteSigninSchema);
  },

  inviteSignin: async (req, res, next) => {
    const { email, name } = req.body;
    const userId = get(req, `user['${KEY}'].x-hasura-user-id`, null);

    if (!userId) {
      return next(Boom.unauthorized('Unauthorized'));
    }

    const admin = await models.User.findOne({ where: { id: userId } });

    if (!admin) {
      return next(Boom.unauthorized('Unauthorized'));
    }

    let signinInvitation = null;

    try {
      signinInvitation = await models.SignInInvitation.create({
        email,
        name,
        UserId: userId,
      });
    } catch (error) {
      console.log('inviteSignin error');
      console.log(error);
    }

    if (!signinInvitation) {
      return next(Boom.badImplementation());
    }

    let host = 'https://medical.equipment';

    if (process.env.NODE_ENV === 'development') {
      host = process.env.AUTHENTICATION_EXPRESS_ENDPOINT;
    }

    const renderVars = {
      host,
      invitationId: signinInvitation.id,
      toName: name,
      fromName: admin.fullName,
    };

    let emailSent = null;

    try {
      emailSent = await mailer.sendMail({
        from: admin.email,
        to: email,
        subject: 'Invitation to create an account on medical.equipment',
        text: renderTextMessage(renderVars),
        html: renderHtmlMessage(renderVars),
      });    
    } catch (error) {
      console.log('inviteSignin email error');
      console.log(error);
    }

    if (!emailSent) {
      return next(Boom.badImplementation());
    }

    console.log(JSON.stringify(emailSent, null, 2));

    res.json({ result: 'Invitation to signin sent' });
  },
};
