const { object, string } = require('yup');

const loginSchema = object({
  email: string().email('Email has to be valid').required('Email is required'),
  password: string().required('Password is required'),
});

module.exports = {
  loginSchema,
};
