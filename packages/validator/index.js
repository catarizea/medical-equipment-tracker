const { object, string, ref } = require('yup');

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const emailValidation = string()
  .email('Email has to be valid')
  .required('Email is required');

const firstNameValidation = string().required('First name is required');

const tokenValidation = string()
  .matches(uuidRegex, 'Token is not valid')
  .required('Token is required');

const newPasswordValidation = {
  password: string()
    .required('Password is required')
    .min(8, `Password has to contain at least 8 characters`)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
      'Password has to contain lowercase and uppercase and numeric characters'
    ),
  confirmPassword: string()
    .required('Please confirm password')
    .oneOf([ref('password'), null], 'Passwords must match'),
  token: tokenValidation,
};

const loginSchema = object({
  email: emailValidation,
  password: string().required('Password is required'),
});

const revokeTokenSchema = object({
  token: tokenValidation,
});

const inviteSigninSchema = object({
  email: emailValidation,
  firstName: firstNameValidation,
});

const userSchema = object({
  firstName: firstNameValidation,
  lastName: string().required('Last name is required'),
  email: emailValidation,
  ...newPasswordValidation,
});

const forgotPasswordSchema = object({
  email: emailValidation,
});

const resetPasswordSchema = object({
  ...newPasswordValidation,
});

module.exports = {
  loginSchema,
  revokeTokenSchema,
  inviteSigninSchema,
  userSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
