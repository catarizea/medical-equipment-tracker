const intersection = require('lodash.intersection');
const Boom = require('@hapi/boom');
const { roles } = require('@medical-equipment-tracker/validator');

const models = require('../../../models');

let attributes = ['id', 'email', 'firstName', 'lastName', 'fullName', 'role'];

const adminOnlyAttributes = [
  'isBlocked',
  'blockedBy',
  'blockedByIp',
  'createdAt',
  'updatedAt',
];

module.exports = {
  fetchUser: async (req, res, next) => {
    const { userId } = req.params;
    const { user } = req;

    const isAdmin = intersection(user.role, [roles.Admin]).length;

    if (isAdmin) {
      attributes = [...attributes, ...adminOnlyAttributes];
    }

    const where = { id: userId };
    if (!isAdmin) {
      where.isBlocked = false;
    }

    const foundUser = await models.User.findOne({
      attributes,
      where,
    });

    if (!foundUser) {
      return next(Boom.badRequest('No account for this id'));
    }

    let blockedBy = null;
    if (foundUser.isBlocked && foundUser.blockedBy) {
      blockedBy = await models.User.findOne({
        attributes: ['firstName', 'lastName', 'fullName', 'email'],
        where: { id: foundUser.blockedBy },
      });
    }

    if (blockedBy) {
      foundUser.blockedBy = blockedBy;
    }

    res.json(foundUser);
  },
};
