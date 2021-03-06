const { generateSchemas } = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');

const { validate } = require('../../../middlewares');
const models = require('../../../models');
const logger = require('../../../services/logger');
const getRequestLanguage = require('../../../services/getRequestLanguage');

module.exports = {
  validateRemoveUser: async (req, res, next) => {
    const language = getRequestLanguage(req);
    const validator = generateSchemas(language);
    await validate(req, next, validator.userIdSchema, true);
  },

  removeUser: async (req, res, next) => {
    const { userId } = req.params;
    const { user: admin } = req;

    const user = await models.User.findOne({ where: { id: userId } });

    if (!user) {
      return next(Boom.badRequest('No account for this id'));
    }

    if (user.id === admin.id) {
      return next(Boom.unauthorized('You cannot remove your own account'));
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
      logger.error('[API] removeUser transaction failed', error)
      
      await t.rollback();
      transactionSuccessful = false;
    }

    if (!transactionSuccessful) {
      return next(Boom.badImplementation());
    }

    res.json({ result: 'User removed' });
  },
};
