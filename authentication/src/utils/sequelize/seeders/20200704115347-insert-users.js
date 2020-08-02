const { v4: uuidv4 } = require('uuid');

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const adminUser = {
      id: uuidv4(),
      firstName: 'Catalin',
      lastName: 'Rizea',
      email: 'catalin@medical.equipment',
      passwordHash: '$2a$10$EET8MHMUPZ4s4GkCnqWwp.dG5msvPNw9Ar/4RcsLx.r./Cv6SWGD6', // Password1
      role: 'user,admin',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const defaultUser = {
      ...adminUser,
      id: uuidv4(),
      firstName: 'Simona',
      lastName: 'Galushka',
      email: 'simona@medical.equipment',
      role: 'user',
    };
    
    return queryInterface.bulkInsert('Users', [adminUser, defaultUser]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
