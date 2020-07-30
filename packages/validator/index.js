const { object, string, ref, number, array, boolean } = require('yup');

const roles = {
  Admin: 'admin',
  Default: 'user',
  Doctor: 'doctor',
  Nurse: 'nurse',
  HR: 'hr',
  Tech: 'tech',
  Warehouse: 'warehouse',
};

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const emailValidation = string()
  .trim()
  .email('Email has to be valid')
  .required('Email is required');

const firstNameValidation = string()
  .trim()
  .strict()
  .required('First name is required');

const tokenValidation = string()
  .trim()
  .matches(uuidRegex, 'Token is not valid')
  .required('Token is required');

const passwordAndConfirm = {
  password: string()
    .trim()
    .required('Password is required')
    .min(8, `Password has to contain at least 8 characters`)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
      'Password has to contain lowercase and uppercase and numeric characters'
    ),
  confirmPassword: string()
    .trim()
    .required('Please confirm password')
    .oneOf([ref('password'), null], 'Passwords must match'),
};

const newPasswordValidation = {
  ...passwordAndConfirm,
  token: tokenValidation,
};

const loginSchema = object({
  email: emailValidation,
  password: string().trim().required('Password is required'),
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
  lastName: string().trim().strict().required('Last name is required'),
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

const udateUserSchema = object({
  firstName: string().trim().strict().notRequired(),
  lastName: string().trim().strict().notRequired(),
  role: array()
    .of(
      string()
        .trim()
        .oneOf(
          Object.values(roles),
          `Role must be one of ${Object.values(roles).join(',')}`
        )
        .required('Role is required')
    )
    .notRequired(),
  isBlocked: boolean().notRequired(),
});

const changePasswordSchema = object({
  currentPassword: string().trim().notRequired(),
  ...passwordAndConfirm,
});

module.exports = {
  loginSchema,
  revokeTokenSchema,
  inviteSignupSchema,
  userSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userIdSchema,
  udateUserSchema,
  roles,
  changePasswordSchema,
};
