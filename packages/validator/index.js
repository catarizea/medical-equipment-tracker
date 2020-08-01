const { object, string, ref, number, array, boolean } = require('yup');
const replace = require('lodash.replace');

const translationMessages = require('./translation.json');

const roles = {
  Admin: 'admin',
  Default: 'user',
  Doctor: 'doctor',
  Nurse: 'nurse',
  HR: 'hr',
  Tech: 'tech',
  Warehouse: 'warehouse',
};

const generateSchemas = (language = 'en') => {
  const messages = translationMessages[language];

  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

  const emailValidation = string()
    .trim()
    .email(messages.emailValid)
    .required(messages.emailRequired);

  const firstNameValidation = string()
    .trim()
    .strict()
    .required(messages.firstNameRequired);

  const tokenValidation = string()
    .trim()
    .matches(uuidRegex, messages.tokenNotValid)
    .required(messages.tokenRequired);

  const passwordAndConfirm = {
    password: string()
      .trim()
      .required(messages.passwordRequired)
      .min(8, messages.passwordAtLeast)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
        messages.passwordHasToContain
      ),
    confirmPassword: string()
      .trim()
      .required(messages.passwordConfirm)
      .oneOf([ref('password'), null], messages.passwordMatch),
  };

  const newPasswordValidation = {
    ...passwordAndConfirm,
    token: tokenValidation,
  };

  const loginSchema = object({
    email: emailValidation,
    password: string().trim().required(messages.passwordRequired),
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
    lastName: string().trim().strict().required(messages.lastNameRequired),
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
      .positive(messages.userIdPositive)
      .integer(messages.userIdInteger)
      .required(messages.userIdRequired),
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
            replace(
              messages.roleMustBeOneOf,
              '{roles}',
              Object.values(roles).join(',')
            )
          )
          .required(messages.roleRequired)
      )
      .notRequired(),
    isBlocked: boolean().notRequired(),
  });

  const changePasswordSchema = object({
    currentPassword: string().trim().notRequired(),
    ...passwordAndConfirm,
  });

  return {
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
};

module.exports = {
  generateSchemas,
  roles,
};
