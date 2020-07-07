const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: 'unix',
  path: '/usr/sbin/sendmail',
});

const sendMail = ({ from, to, subject, text, html }) => {
  transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  }, (err, info) => {
    console.log(err);
    console.log(info.envelope);
    console.log(info.messageId);
  });
};

module.exports = sendMail;
