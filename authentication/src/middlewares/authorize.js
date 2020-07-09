const path = require('path');
const Boom = require('@hapi/boom');
const expressJwt = require('express-jwt');
const get = require('lodash.get');
const intersection = require('lodash.intersection');

const models = require('../models');
const { KEY } = require('../constants/claims');

const envFile =
  process.env.NODE_ENV === 'development'
    ? '.env.development.local'
    : '.env.production.local';
require('dotenv').config({ path: path.join(__dirname, '../../..', envFile) });

const secret = JSON.parse(process.env.HASURA_GRAPHQL_JWT_SECRET);

const authorize = (roles) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    expressJwt({ secret: secret.key, algorithms: [secret.type] }),

    async (req, res, next) => {
      const userId = get(req, `user['${KEY}'].x-hasura-user-id`, null);

      if (!userId || !roles.length) {
        next(Boom.unauthorized('Unauthorized'));
      }

      const user = await models.User.findOne({ where: { id: userId } });

      if (!user || !intersection(roles, user.role).length) {
        next(Boom.unauthorized('Unauthorized'));
      }

      req.user.role = user.role;

      const ownTokens = await models.RefreshToken.findAll({
        where: { UserId: userId },
      });
      req.user.ownsToken = (token) =>
        !!ownTokens.find((tokn) => tokn.token === token);

      next();
    },
  ];
};

module.exports = authorize;
