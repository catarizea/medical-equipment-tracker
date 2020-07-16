const models = require('../../models');

const email = 'simona@medical.equipment';
const password = 'Password1';

module.exports = {
  insert: async () => {
    await models.User.create({
      firstName: 'Simona',
      lastName: 'Galushka',
      email,
      passwordHash:
        '$2a$10$EET8MHMUPZ4s4GkCnqWwp.dG5msvPNw9Ar/4RcsLx.r./Cv6SWGD6',
      role: ['User'],
      isBlocked: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },
  remove: () => {
    models.User.destroy({ where: { email } });
  },
  email,
  password,
};
