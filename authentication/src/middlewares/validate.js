const { VALIDATION_ERROR } = require('../constants/validation');

const validate = async (req, next, schema) => {
  const options = {
    abortEarly: false,
    stripUnknown: true,
  };

  try {
    const validObject = await schema.validate(req.body, options);
    req.body = validObject;
    next();
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => (errors[err.path] = err.errors[0]));
    next(`${VALIDATION_ERROR}${JSON.stringify(errors, null, 2)}`);
  }
};

module.exports = validate;
