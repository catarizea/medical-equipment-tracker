const { VALIDATION_ERROR } = require('../constants/validation');

const validate = async (req, next, schema, checkParams = false, checkQuery = false) => {
  const options = {
    abortEarly: false,
    stripUnknown: true,
  };

  let whatToCheck = req.body;

  if (checkParams) {
    whatToCheck = req.params;
  }

  if (checkQuery) {
    whatToCheck = req.query;
  }

  if (!whatToCheck || !Object.keys(whatToCheck).length) {
    return next(`${VALIDATION_ERROR}${JSON.stringify({ empty: 'Entity is required' })}`);
  }

  try {
    const validObject = await schema.validate(whatToCheck, options);
    if (checkParams) {
      req.params = validObject;
    } else if (checkQuery) {
      req.query = validObject;
    } else {
      req.body = validObject;
    }
    
    next();
  } catch (error) {
    if (error.inner && error.inner.length) {
      const errors = {};
      error.inner.forEach((err) => (errors[err.path] = err.errors[0]));
      next(`${VALIDATION_ERROR}${JSON.stringify(errors)}`);
    } else {
      next(error);
    }
  }
};

module.exports = validate;
