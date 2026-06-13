'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('vendors', [
      // Unit 1 — Siloam Lippo Village (mirrors the PDF mockup rows)
      { vendor_id: 'Vendor001', name: 'Vendor 001', address: 'Tangerang', unit_id: 1, created_at: now, updated_at: now },
      { vendor_id: 'Vendor002', name: 'Vendor 002', address: 'Jakarta Pusat', unit_id: 1, created_at: now, updated_at: now },
      { vendor_id: 'Vendor003', name: 'Vendor 003', address: 'Bangka', unit_id: 1, created_at: now, updated_at: now },
      { vendor_id: 'Vendor004', name: 'Vendor 004', address: 'Tangerang', unit_id: 1, created_at: now, updated_at: now },
      // Unit 2 — Siloam Bogor
      { vendor_id: 'Vendor001', name: 'Bogor Supplier A', address: 'Bogor', unit_id: 2, created_at: now, updated_at: now },
      { vendor_id: 'Vendor002', name: 'Bogor Supplier B', address: 'Cibinong', unit_id: 2, created_at: now, updated_at: now },
      // Unit 3 — Siloam Makassar
      { vendor_id: 'Vendor001', name: 'Makassar Supplier A', address: 'Makassar', unit_id: 3, created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('vendors', null, {});
  },
};
