const server = require('./server');
const { logger } = require('./services');

const port = process.env.AUTHENTICATION_EXPRESS_PORT || 3500;

server.listen(port, () => {
  logger.info(`App is listening on port ${port}`);
});
