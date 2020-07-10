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
    const errors = {};
    error.inner.forEach((err) => (errors[err.path] = err.errors[0]));
    next(`${VALIDATION_ERROR}${JSON.stringify(errors)}`);
  }
};

module.exports = validate;
