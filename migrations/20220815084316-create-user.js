'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    // default admin username: admin | password: admin
    await queryInterface.sequelize.query(`insert into users values ('AMDIN', 'admin', 'admin', 'admin', '$2a$10$9J86sK9A2j3hfLqIaJxoTOnti2tZziUpjlqb3UdQt6yugL293vrUm', '1', '', '')`);
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('users');
  }
};