const jwt = require('jsonwebtoken');
const path = require('path');
const { roles } = require('@medical-equipment-tracker/validator');

require('dotenv').config({ path: path.join(__dirname, '../../..', `.env.${process.env.NODE_ENV}.local`) });

const jwtSecret = JSON.parse(process.env.HASURA_GRAPHQL_JWT_SECRET);
const customClaims = process.env.AUTHENTICATION_CUSTOM_CLAIMS
  ? process.env.AUTHENTICATION_CUSTOM_CLAIMS.split(',')
  : [];

const { KEY } = require('../constants/claims');

const generateJwtToken = (user) => {
  const custom_claims = {};

  customClaims.forEach((userField) => {
    custom_claims['x-hasura-' + userField.replace('_', '-')] = user[
      userField
    ].toString();
  });

  if (!user.role.includes(roles.Default)) {
    user.role.push(roles.Default);
  }

  return jwt.sign(
    {
      [KEY]: {
        'x-hasura-allowed-roles': user.role,
        'x-hasura-default-role': roles.Default,
        'x-hasura-user-id': user.id.toString(),
        ...custom_claims,
      },
    },
    jwtSecret.key,
    {
      algorithm: jwtSecret.type,
      expiresIn: `${process.env.AUTHENTICATION_JWT_TOKEN_EXPIRES}m`,
    }
  );
};

module.exports = generateJwtToken;
