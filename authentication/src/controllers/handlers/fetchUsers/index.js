const models = require('../../../models');
const generateWhere = require('../../../services/generateWhere');

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
      console.log('fetchUsers findAll error');
      console.log(error);
    }

    res.json(users);
  },
};
