const morgan = require('morgan');
const { logger } = require('../services');

let httpLogger = (req, res, next) => {
  next();
};

if (process.env.NODE_ENV !== 'test') {
  logger.stream = {
    write: (message) =>
      logger.info(message.substring(0, message.lastIndexOf('\n'))),
  };

  httpLogger = morgan(
    '[API] :method :url :status :response-time ms - :res[content-length]',
    { stream: logger.stream }
  );
}

module.exports = httpLogger;
