'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const objects = await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Catalin',
        lastName: 'Rizea',
        username: 'catalinrizea',
        passwordHash: 'password',
        role: 'User, Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
