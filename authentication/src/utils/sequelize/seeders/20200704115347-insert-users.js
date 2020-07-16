'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const adminUser = {
      firstName: 'Catalin',
      lastName: 'Rizea',
      email: 'catalin@medical.equipment',
      passwordHash: '$2a$10$EET8MHMUPZ4s4GkCnqWwp.dG5msvPNw9Ar/4RcsLx.r./Cv6SWGD6', // Password1
      role: 'User,Admin',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const defaultUser = {
      ...adminUser,
      firstName: 'Simona',
      lastName: 'Galushka',
      email: 'simona@medical.equipment',
      role: 'User',
    };
    
    return queryInterface.bulkInsert('Users', [adminUser, defaultUser]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
