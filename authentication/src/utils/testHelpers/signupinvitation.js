const models = require('../../models');
const { v4: uuidv4 } = require('uuid');

const invitee = {
  email: 'boshuruku@medical.equipment',
  name: 'Boshuruku',
  UserId: 1,
  token: uuidv4(),
};

module.exports = {
  createSignupInvitation: async () => {
    const invited = await models.SignupInvitation.create(invitee, { returning: true });
    return invited;
  },

  destroySignupInvitation: async () => {
    await models.SignupInvitation.destroy({ where: { email: invitee.email } });
  },
};
