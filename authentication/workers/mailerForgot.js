const { consume } = require('@medical-equipment-tracker/message-broker');
const mailer = require('@medical-equipment-tracker/mailer');

const logger = require('../src/services/logger');
const renderTextMessage = require('../src/utils/emailTemplates/forgotPassword/textTemplate');
const renderHtmlMessage = require('../src/utils/emailTemplates/forgotPassword/htmlTemplate');

const consumer = async (msg, ch) => {
  console.log('Forgot password task received...');
  const { to, renderVars } = JSON.parse(msg.content);

  try {
    emailSent = await mailer.sendMail({
      from: 'noreply@medical.equipment',
      to,
      subject: 'Reset your password on medical.equipment',
      text: renderTextMessage(renderVars),
      html: renderHtmlMessage(renderVars),
    });

    ch.ack(msg);
  } catch (error) {
    logger.error('forgotPassword email error', error);
  }
};

consume(process.env.WORKER_MAILER_FORGOT_QUEUE, consumer);
