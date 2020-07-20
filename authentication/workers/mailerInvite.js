const { consume } = require('@medical-equipment-tracker/message-broker');
const mailer = require('@medical-equipment-tracker/mailer');

const logger = require('../src/services/logger');
const renderTextMessage = require('../src/utils/emailTemplates/inviteSignup/textTemplate');
const renderHtmlMessage = require('../src/utils/emailTemplates/inviteSignup/htmlTemplate');

const consumer = async (msg, ch) => {
  const { to, renderVars } = JSON.parse(msg.content);
  logger.info(`signup invite mail to send to ${to}`);

  try {
    await mailer.sendMail({
      from: 'noreply@medical.equipment',
      to,
      subject: 'Invitation to create an account on medical.equipment',
      text: renderTextMessage(renderVars),
      html: renderHtmlMessage(renderVars),
    });

    ch.ack(msg);
  } catch (error) {
    logger.error('inviteSignup email error', error);
  }
};

consume(process.env.WORKER_MAILER_INVITE_QUEUE, consumer);
