const Boom = require('@hapi/boom');

const models = require('../../../models');

module.exports = {
  undoRevokeAccess: async (req, res, next) => {
    const { userId } = req.params;
    const { user: admin } = req;

    const user = await models.User.findOne({ where: { id: userId } });

    if (!user) {
      return next(Boom.badRequest('No account for this id'));
    }

    if (user.id === parseInt(admin.id, 10)) {
      return next(Boom.badRequest('You cannot undo revoke access your own account'));
    }

    if (!user.isBlocked) {
      return next(Boom.badRequest('Access is not revoked for this account'));
    }

    let updatedUser = null;

    try {
      updatedUser = await models.User.update(
        {
          isBlocked: false,
          blockedBy: null,
          blockedByIp: null,
          role: user.role,
        },
        { where: { id: userId } }
      );
      
    } catch (error) {
      console.log('undoRevokeAccess update failed');
      console.log(error);
    }

    if (!updatedUser) {
      return next(Boom.badImplementation());
    }

    res.json({ result: 'Access revoked undone' });
  },
};
