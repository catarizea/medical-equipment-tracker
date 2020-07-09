const { object, string } = require('yup');

const loginSchema = object({
  email: string().email('Email has to be valid').required('Email is required'),
  password: string().required('Password is required'),
});

const revokeTokenSchema = object({
  token: string()
    .matches(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      'Token is not valid'
    )
    .required('Token is required'),
});

module.exports = {
  loginSchema,
  revokeTokenSchema,
};
