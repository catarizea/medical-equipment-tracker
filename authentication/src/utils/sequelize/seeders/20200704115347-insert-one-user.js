'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const objects = await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Catalin',
        lastName: 'Rizea',
        email: 'catalin@medical.equipment',
        passwordHash: '$2a$10$EET8MHMUPZ4s4GkCnqWwp.dG5msvPNw9Ar/4RcsLx.r./Cv6SWGD6', // Password1
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
