'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('units', [
      { id: 1, name: 'Siloam Lippo Village', created_at: now, updated_at: now },
      { id: 2, name: 'Siloam Bogor', created_at: now, updated_at: now },
      { id: 3, name: 'Siloam Makassar', created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('units', null, {});
  },
};
