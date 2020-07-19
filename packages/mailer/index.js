const nodemailer = require('nodemailer');

let mailer = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
});

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  mailer = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
}

module.exports = mailer;
