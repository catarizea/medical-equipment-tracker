/* eslint no-unused-vars: 0 */
const { VALIDATION_ERROR } = require('../constants/validation');

const handleErrors = (err, req, res, next) => {  
  switch (true) {
    case err.name === 'UnauthorizedError':
      return res
        .status(401)
        .json({ type: 'Unauthorized', message: 'Invalid token' });

    case typeof err === 'string':
      if (err.indexOf(VALIDATION_ERROR) !== -1) {
        const parts = err.split(VALIDATION_ERROR);
        return res
          .status(400)
          .json({ type: VALIDATION_ERROR, message: JSON.parse(parts[1]) });
      }
      break;
    
    case err.type && err.type === 'entity.parse.failed':
      return res
          .status(400)
          .json({ type: 'Bad request', message: 'Entity parse failed' });
    
    case err.isBoom:
      const {
        statusCode,
        payload: { error, message },
      } = err.output;
      return res.status(statusCode).json({ type: error, message });
    
    default:
      return res
        .status(500)
        .json({
          type: 'Internal Server Error',
          message: 'An internal server error occurred',
        });
  }
};

module.exports = handleErrors;
