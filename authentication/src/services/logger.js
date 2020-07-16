const path = require('path');
const { createLogger, transports, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

let logger = {
  error: () => {},
  info: () => {},
};

if (process.env.NODE_ENV !== 'test') {
  logger = createLogger({
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
    transports: [
      new DailyRotateFile({
        filename: path.join(__dirname, '..', 'logs/all-logs-%DATE%.log'),
        json: false,
        maxsize: 5242880,
        maxFiles: 5,
      }),
      new transports.Console(),
    ],
  });
}

module.exports = logger;
