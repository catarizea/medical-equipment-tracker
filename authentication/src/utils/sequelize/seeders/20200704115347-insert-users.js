'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const adminUser = {
      id: 'ff39e1cf-8950-4ccc-ac89-f823a89b89a1',
      firstName: 'Catalin',
      lastName: 'Rizea',
      email: 'catalin@medical.equipment',
      passwordHash:
        '$2a$10$EET8MHMUPZ4s4GkCnqWwp.dG5msvPNw9Ar/4RcsLx.r./Cv6SWGD6', // Password1
      role: 'user,admin',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const defaultUser = {
      ...adminUser,
      id: 'bddff5e7-6600-4446-986f-e410501daa2b',
      firstName: 'Simona',
      lastName: 'Galushka',
      email: 'simona@medical.equipment',
      role: 'user,doctor',
    };

    const nurseUser = {
      ...adminUser,
      id: '8e455947-6253-4978-852e-b2589281fcb8',
      firstName: 'Marietta',
      lastName: 'Martin',
      email: 'marietta@medical.equipment',
      role: 'user,nurse',
    };

    const warehouseUser = {
      ...adminUser,
      id: 'e59dd057-cce9-4555-88fc-d1f5dae82fbf',
      firstName: 'Pavel',
      lastName: 'Sivornian',
      email: 'pavel@medical.equipment',
      role: 'user,warehouse',
    };

    const hrUser = {
      ...adminUser,
      id: '210f045f-ed95-4b8d-bdda-784545600f43',
      firstName: 'Sonia',
      lastName: 'Mosneag',
      email: 'sonia@medical.equipment',
      role: 'user,hr',
    };

    const techUser = {
      ...adminUser,
      id: '3d8b4f5e-9827-4371-9593-8481b58f74c8',
      firstName: 'Gaius',
      lastName: 'Apolodor',
      email: 'gaius@medical.equipment',
      role: 'user,tech',
    };

    return queryInterface.bulkInsert('Users', [
      adminUser,
      defaultUser,
      nurseUser,
      warehouseUser,
      hrUser,
      techUser,
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
