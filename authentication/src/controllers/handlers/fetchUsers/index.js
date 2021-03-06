const models = require('../../../models');
const generateWhere = require('../../../services/generateWhere');
const logger = require('../../../services/logger');

const attributes = [
  'id',
  'email',
  'firstName',
  'lastName',
  'fullName',
  'role',
  'isBlocked',
  'createdAt',
  'updatedAt',
];

module.exports = {
  fetchUsers: async (req, res, next) => {
    const where = req.query ? generateWhere(req.query, attributes) : {};

    let users = [];

    try {
      users = await models.User.findAll({ where, attributes });
    } catch (error) {
      logger.error('[API] fetchUsers findAll error', error);
    }

    res.json(users);
  },
};
