'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('users', [{
      name: 'test',
      email: 'test@gmail.com',
      password: 'JVijTU0glkyh0nKrJszOlRHYgFeVk81MngGrke0A8yU=',
      createdAt: new Date(),
      updatedAt: new Date()  
    }], {});
    await queryInterface.bulkInsert('users', [{
      name: 'John Doe2',
      email: 'test1@gmail.com',
      password: 'test',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
