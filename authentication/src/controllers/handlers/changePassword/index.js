const Boom = require('@hapi/boom');
const { generateSchemas, roles } = require('@medical-equipment-tracker/validator');
const bcrypt = require('bcryptjs');
const intersection = require('lodash.intersection');

const { validate } = require('../../../middlewares');
const models = require('../../../models');
const { VALIDATION_ERROR } = require('../../../constants/validation');
const logger = require('../../../services/logger');
const getRequestLanguage = require('../../../services/getRequestLanguage');

module.exports = {
  validateChangePassword: async (req, res, next) => {
    const language = getRequestLanguage(req);
    const validator = generateSchemas(language);
    await validate(req, next, validator.changePasswordSchema);
  },

  changePassword: async (req, res, next) => {
    const { userId } = req.params;
    const { user } = req;
    const { currentPassword, password } = req.body;

    const isAdmin = intersection(user.role, [roles.Admin]).length;

    if ((!isAdmin || (isAdmin && userId === user.id)) && !currentPassword) {
      return next(
        `${VALIDATION_ERROR}${JSON.stringify({
          currentPassword: 'Current password is required',
        })}`
      );
    }

    if (!isAdmin && user.id !== userId) {
      return next(Boom.unauthorized('Unauthorized'));
    }

    const foundUser = await models.User.findOne({ where: { id: userId } });

    if (!foundUser) {
      return next(Boom.badRequest('No account for this id'));
    }

    if (!isAdmin || (isAdmin && userId === user.id)) {
      const match = await bcrypt.compare(
        currentPassword,
        foundUser.passwordHash
      );

      if (!match) {
        return next(Boom.badRequest('Current password is incorrect'));
      }
    }

    let passwordHash = null;

    try {
      passwordHash = await bcrypt.hash(password, 10);
    } catch (error) {
      logger.error('[API] changePassword hashing error', error);
    }

    if (!passwordHash) {
      return next(Boom.badImplementation());
    }

    let updatedUser = null;

    try {
      updatedUser = await models.User.update(
        { passwordHash, role: foundUser.role },
        { where: { id: foundUser.id } }
      );
    } catch (error) {
      logger.error('[API] changePassword update error', error);
    }

    if (!updatedUser) {
      return next(Boom.badImplementation());
    }

    res.json({ result: 'Password changed' });
  },
};
