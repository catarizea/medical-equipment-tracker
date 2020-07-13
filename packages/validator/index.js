const { object, string, ref, number } = require('yup');

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

const inviteSignupSchema = object({
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

const userIdSchema = object({
  userId: number()
    .positive('User id has to be positive number')
    .integer('User id has to be an integer')
    .required('User id is required'),
});

module.exports = {
  loginSchema,
  revokeTokenSchema,
  inviteSignupSchema,
  userSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userIdSchema,
};
