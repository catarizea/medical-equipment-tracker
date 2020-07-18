const models = require('../../models');

module.exports = {
  createForgotPassword: async (object) => {
    const forgot = await models.ForgotPassword.create({ ...object }, { returning: true });
    return forgot;
  },

  destroyForgotPassword: async (token) => {
    await models.ForgotPassword.destroy({ where: { token } });
  },
};
