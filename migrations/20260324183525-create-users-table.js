'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        comment: 'Unique user identifier'
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      profile_picture: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'role1', 'role2', 'pending'),
        allowNull: false,
        defaultValue: 'pending'
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });

    /** indexes for better performance  **/
    await queryInterface.addIndex('users', ['username'], {
      unique: true,
      name: 'idx_users_username'
    });

    await queryInterface.addIndex('users', ['role'], {
      name: 'idx_users_role'
    });

    await queryInterface.addIndex('users', ['is_deleted'], {
      name: 'idx_users_is_deleted'
    });

    await queryInterface.addIndex('users', ['role', 'is_deleted'], {
      name: 'idx_users_role_deleted'
    });

    await queryInterface.addIndex('users', ['created_at'], {
      name: 'idx_users_created_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};