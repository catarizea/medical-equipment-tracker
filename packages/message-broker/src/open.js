const amqp = require('amqplib');

const {
  RABBITMQ_USERNAME,
  RABBITMQ_PASSWORD,
  RABBITMQ_HOST,
  RABBITMQ_PORT,
} = process.env;

module.exports = amqp.connect(
  `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`
);
