const validator = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');

const validate = require('../../middlewares/validate');
const models = require('../../models');

module.exports = {
  validateRevokeAccess: async (req, res, next) => {
    await validate(req, next, validator.userIdSchema, true);
  },

  revokeAccess: async (req, res, next) => {
    const { userId } = req.params;
    const { user: admin } = req;

    const user = await models.User.findOne({ where: { id: userId } });

    if (!user) {
      return next(Boom.badRequest('No account for this id'));
    }

    if (user.id === parseInt(admin.id, 10)) {
      return next(Boom.badRequest('You cannot revoke your own access'));
    }

    if (user.isBlocked) {
      return next(Boom.badRequest('Access already revoked for this account'));
    }

    const t = await models.sequelize.transaction();

    let transactionSuccessful = true;

    try {
      await models.User.update(
        {
          isBlocked: true,
          blockedBy: admin.id,
          blockedByIp: req.ip,
          role: user.role,
        },
        { where: { id: userId }, transaction: t }
      );

      await models.RefreshToken.update(
        { revokedAt: new Date(), revokedBy: admin.id, revokedByIp: req.ip },
        { where: { UserId: userId, revokedAt: null }, transaction: t }
      );

      await t.commit();
    } catch (error) {
      console.log('revokeAccess transaction failed');
      console.log(error);

      await t.rollback();
      transactionSuccessful = false;
    }

    if (!transactionSuccessful) {
      return next(Boom.badImplementation());
    }

    res.json({ result: 'Access revoked' });
  },
};
