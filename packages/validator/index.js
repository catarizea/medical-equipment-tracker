const { object, string, ref } = require('yup');

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const loginSchema = object({
  email: string().email('Email has to be valid').required('Email is required'),
  password: string().required('Password is required'),
});

const revokeTokenSchema = object({
  token: string()
    .matches(
      uuidRegex,
      'Token is not valid'
    )
    .required('Token is required'),
});

const inviteSigninSchema = object({
  email: string().email('Email has to be valid').required('Email is required'),
  name: string().required('Name is required'),
});

const userSchema = object({
  firstName: string().required('First name is required'),
  lastName: string().required('Last name is required'),
  email: string().email('Email has to be valid').required('Email is required'),
  password: string()
    .required('Password is required')
    .min(8, `Password has to contain at least 8 characters`)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
      'Password has to contain at least 1 lowercase, 1 uppercase, 1 numeric characters'
    ),
  confirmPassword: string()
    .required('Please confirm password')
    .oneOf([ref('password'), null], 'Passwords must match'),
  token: string()
    .matches(
      uuidRegex,
      'Token is not valid'
    )
    .required('Token is required'),
});

module.exports = {
  loginSchema,
  revokeTokenSchema,
  inviteSigninSchema,
  userSchema,
};
