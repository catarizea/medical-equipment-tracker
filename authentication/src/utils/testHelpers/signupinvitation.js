const models = require('../../models');

module.exports = {
  createSignupInvitation: async (invitee) => {
    const invited = await models.SignupInvitation.create(invitee, { returning: true });
    return invited;
  },

  destroySignupInvitation: async (invitee) => {
    await models.SignupInvitation.destroy({ where: { email: invitee.email } });
  },
};
