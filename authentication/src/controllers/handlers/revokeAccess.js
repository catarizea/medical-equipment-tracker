const validator = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');

const validate = require('../../middlewares/validate');
const models = require('../../models');
const { VALIDATION_ERROR } = require('../../constants/validation');

module.exports = {
  validateRevokeAccess: async (req, res, next) => {
    console.log('req.params.userId', req.params.userId);
    if (!req.params.userId) {
      return next(`${VALIDATION_ERROR}${JSON.stringify({ userId: 'User id is required' })}`);
    }
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
        { where: { id: userId } }
      );

      await models.RefreshToken.update(
        { revokedAt: new Date(), revokedBy: admin.id, revokedByIp: req.ip },
        { where: { UserId: userId, revokedAt: null } }
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
