const path = require('path');
const validator = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const { v4: uuidv4 } = require('uuid');
const mailer = require('@medical-equipment-tracker/mailer');

const validate = require('../../../middlewares/validate');
const models = require('../../../models');
const { revokeAccess } = require('../logout');
const renderTextMessage = require('../../../utils/emailTemplates/forgotPassword/textTemplate');
const renderHtmlMessage = require('../../../utils/emailTemplates/forgotPassword/htmlTemplate');

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.production.local';
require('dotenv').config({
  path: path.join(__dirname, '../../../../..', envFile),
});

module.exports = {
  validateForgotPassword: async (req, res, next) => {
    await validate(req, next, validator.forgotPasswordSchema);
  },

  forgotPassword: async (req, res, next) => {
    const { email } = req.body;

    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return next(Boom.badRequest('No account for this email'));
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
      console.log('forgotPassword create error');
      console.log(error);
    }

    if (!dbForgotPassword) {
      return next(Boom.badImplementation());
    }

    let emailSent = null;

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

    try {
      emailSent = await mailer.sendMail({
        from: 'noreply@medical.equipment',
        to: user.email,
        subject: 'Reset your password on medical.equipment',
        text: renderTextMessage(renderVars),
        html: renderHtmlMessage(renderVars),
      });    
    } catch (error) {
      console.log('forgotPassword email error');
      console.log(error);
    }

    if (!emailSent) {
      return next(Boom.badImplementation());
    }

    console.log(JSON.stringify(emailSent, null, 2));
    
    res.json({ result: 'Reset email message sent' });
  },
};
