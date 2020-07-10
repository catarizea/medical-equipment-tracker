const path = require('path');
const nodemailer = require('nodemailer');

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.production.local';
require('dotenv').config({
  path: path.join(__dirname, '../..', envFile),
});

let mailer = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
});

if (process.env.NODE_ENV === 'development') {
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
