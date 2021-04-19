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
    await queryInterface.bulkInsert('likes', [{
      userId: 1,
      contentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('likes', [{
      userId: 2,
      contentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('likes', [{
      userId: 3,
      contentId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('likes', [{
      userId: 2,
      contentId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('likes', [{
      userId: 3,
      contentId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('likes', [{
      userId: 2,
      contentId: 2,
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
