'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const objects = await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Catalin',
        lastName: 'Rizea',
        email: 'catalin@medical.equipment',
        passwordHash: '$2a$10$EJ44qODozStE1rm1c/hWSOkR.rv4nun7.5yYqzZX9JbJx0GCpADye',
        role: 'User,Admin',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
