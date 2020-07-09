const Boom = require('@hapi/boom');
const get = require('lodash.get');
const intersection = require('lodash.intersection');
const validator = require('@medical-equipment-tracker/validator');

const models = require('../../models');
const { KEY } = require('../../constants/claims');
const roles = require('../../constants/roles');
const validate = require('../../middlewares/validate');

module.exports = {
  validateRevokeToken: async (req, res, next) => {
    await validate(req, next, validator.revokeTokenSchema);
  },

  revokeToken: async (req, res, next) => {
    const userId = get(req, `user['${KEY}'].x-hasura-user-id`, null);
    const userRoles = get(req, `user['${KEY}'].x-hasura-allowed-roles`, null);

    if (
      !userId ||
      !userRoles ||
      !userRoles.length ||
      !intersection(userRoles, [roles.Default].length)
    ) {
      return next(Boom.unauthorized('Unauthorized'));
    }

    const { token } = req.body;

    const refreshToken = await models.RefreshToken.findOne({
      where: { token },
    });
    const isAdmin = !!intersection(userRoles, [roles.Admin]).length;

    if (
      !refreshToken ||
      (refreshToken.UserId !== parseInt(userId, 10) && !isAdmin)
    ) {
      return next(Boom.unauthorized('Unauthorized'));
    }

    if (refreshToken.revokedAt) {
      return next(Boom.badRequest('Token already revoked'));
    }

    const revokedToken = {
      revokedAt: new Date(),
      revokedByIp: req.ip,
    };

    let tokenRevoked = null;
    try {
      tokenRevoked = await models.RefreshToken.update(revokedToken, {
        where: { id: refreshToken.id },
      });
    } catch (error) {
      console.log('revokeToken error');
      console.log(error);
    }

    if (!tokenRevoked) {
      return next(Boom.badImplementation());
    }

    res.json({ result: 'Token revoked' });
  },
};
