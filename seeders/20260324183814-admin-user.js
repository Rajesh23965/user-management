'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('Admin@123', 12);

    await queryInterface.bulkInsert('users', [
      {
        first_name: 'Rajesh',
        last_name: 'Yadav',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { username: 'admin' });
  }
};