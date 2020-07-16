const path = require('path');
const server = require('./server');
const { logger } = require('./services');

require('dotenv').config({
  path: path.join(__dirname, '../..', `.env.${process.env.NODE_ENV}.local`),
});

const port = process.env.AUTHENTICATION_EXPRESS_PORT || 3500;

server.listen(port, () => {
  logger.info(`App is listening on port ${port}`);
});
