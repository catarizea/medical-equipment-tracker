const {
  generateSchemas,
  roles,
} = require('@medical-equipment-tracker/validator');
const Boom = require('@hapi/boom');
const intersection = require('lodash.intersection');
const uniq = require('lodash.uniq');
const { htmlEscape } = require('escape-goat');

const models = require('../../../models');
const { validate } = require('../../../middlewares');
const logger = require('../../../services/logger');
const getRequestLanguage = require('../../../services/getRequestLanguage');

const attributes = [
  'id',
  'email',
  'firstName',
  'lastName',
  'fullName',
  'role',
  'isBlocked',
  'defaultRole',
];

const getUpdateWith = (body, isAdmin) => {
  const updateWith = {};
  ['firstName', 'lastName', 'role', 'isBlocked', 'defaultRole'].forEach(
    (key) => {
      if (key in body) {
        if (key !== 'role' && key !== 'isBlocked') {
          updateWith[key] = htmlEscape(body[key]);
        } else {
          if (isAdmin) {
            updateWith[key] = body[key];
          }
        }
      }
    }
  );

  if ('role' in updateWith) {
    updateWith.role = uniq(updateWith.role);
  }

  return updateWith;
};

module.exports = {
  validateUpdateUser: async (req, res, next) => {
    const language = getRequestLanguage(req);
    const validator = generateSchemas(language);
    await validate(req, next, validator.udateUserSchema);
  },

  updateUser: async (req, res, next) => {
    const { userId } = req.params;
    const { user } = req;

    const isAdmin = intersection(user.role, [roles.Admin]).length;
    const updateWith = getUpdateWith(req.body, isAdmin);

    const foundUser = await models.User.findOne({
      attributes,
      where: { id: userId },
    });

    if (!foundUser) {
      return next(Boom.badRequest('No account for this id'));
    }

    if (!isAdmin && (foundUser.id !== user.id || foundUser.isBlocked)) {
      return next(Boom.unauthorized('Unauthorized'));
    }

    if (('role' in updateWith || 'defaultRole' in updateWith) && user.id === foundUser.id) {
      return next(Boom.unauthorized('You cannot update your own role'));
    }

    if ('isBlocked' in updateWith) {
      if (foundUser.id === user.id) {
        return next(Boom.unauthorized('You cannot update your own access'));
      }

      if (updateWith.isBlocked === false) {
        updateWith.blockedBy = null;
        updateWith.blockedByIp = null;
      } else {
        updateWith.blockedBy = user.id;
        updateWith.blockedByIp = req.ip;
      }
    }

    if (
      'role' in updateWith &&
      updateWith.role.length === 1 &&
      updateWith.role[0] === roles.Admin
    ) {
      updateWith.role.push(roles.Default);
    }

    if (!updateWith.role) {
      updateWith.role = foundUser.role;
    }

    if (
      'defaultRole' in updateWith &&
      !updateWith.role.includes(updateWith.defaultRole)
    ) {
      return next(Boom.badRequest('Default role not in user roles'));
    }

    let updatedUser = null;

    const updateUser = async () => {
      updatedUser = await models.User.update(updateWith, {
        where: { id: userId },
      });
    };

    if (updateWith.blockedBy) {
      const t = await models.sequelize.transaction();

      let transactionSuccessful = true;

      try {
        await updateUser();

        await models.RefreshToken.update(
          { revokedAt: new Date(), revokedBy: user.id, revokedByIp: req.ip },
          { where: { UserId: userId, revokedAt: null }, transaction: t }
        );

        await t.commit();
      } catch (error) {
        logger.error('[API] updateUser transaction failed', error);

        await t.rollback();
        transactionSuccessful = false;
      }

      if (!transactionSuccessful) {
        return next(Boom.badImplementation());
      }
    } else {
      try {
        await updateUser();
      } catch (error) {
        logger.error('[API] updateUser error', error);
      }
    }

    if (!updatedUser) {
      return next(Boom.badImplementation());
    }

    res.json({ result: 'User updated' });
  },
};
