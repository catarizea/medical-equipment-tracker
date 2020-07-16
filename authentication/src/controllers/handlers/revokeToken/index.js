const Boom = require('@hapi/boom');
const intersection = require('lodash.intersection');
const validator = require('@medical-equipment-tracker/validator');

const models = require('../../../models');
const { validate } = require('../../../middlewares');
const logger = require('../../../services/logger');

const { roles } = validator;

module.exports = {
  validateRevokeToken: async (req, res, next) => {
    await validate(req, next, validator.revokeTokenSchema);
  },

  revokeToken: async (req, res, next) => {
    const { user } = req;
    const { token } = req.body;

    const refreshToken = await models.RefreshToken.findOne({
      where: { token },
    });
    const isAdmin = !!intersection(user.role, [roles.Admin]).length;

    if (
      !refreshToken ||
      (refreshToken.UserId !== parseInt(user.id, 10) && !isAdmin)
    ) {
      return next(Boom.unauthorized('Unauthorized'));
    }

    if (refreshToken.revokedAt) {
      return next(Boom.badRequest('Token already revoked'));
    }

    const revokedToken = {
      revokedAt: new Date(),
      revokedBy: user.id,
      revokedByIp: req.ip,
    };

    let tokenRevoked = null;
    try {
      tokenRevoked = await models.RefreshToken.update(revokedToken, {
        where: { id: refreshToken.id },
      });
    } catch (error) {
      logger.error('revokeToken error', error);
    }

    if (!tokenRevoked) {
      return next(Boom.badImplementation());
    }

    res.json({ result: 'Token revoked' });
  },
};
