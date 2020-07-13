const validator = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');

const validate = require('../../middlewares/validate');
const models = require('../../models');

module.exports = {
  validateRemoveUser: async (req, res, next) => {
    await validate(req, next, validator.userIdSchema, true);
  },

  removeUser: async (req, res, next) => {
    const { userId } = req.params;
    const { user: admin } = req;

    const user = await models.User.findOne({ where: { id: userId } });

    if (!user) {
      return next(Boom.badRequest('No account for this id'));
    }

    if (user.id === parseInt(admin.id, 10)) {
      return next(Boom.badRequest('You cannot remove your own account'));
    }

    const t = await models.sequelize.transaction();

    let transactionSuccessful = true;

    try {
      await models.User.destroy({ where: { id: userId }, transaction: t });

      await models.RemovedUser.create({
        removedId: userId,
        email: user.email,
        removedByIp: req.ip,
        removedBy: admin.id,
      }, { transaction: t });

      await t.commit();
    } catch (error) {
      console.log('removeUser transaction failed');
      console.log(error);
      
      await t.rollback();
      transactionSuccessful = false;
    }

    if (!transactionSuccessful) {
      return next(Boom.badImplementation());
    }

    res.json({ result: 'User removed' });
  },
};
