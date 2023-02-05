'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('mails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      region_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'regions', 
          key: 'id'
        }
      },
      creator: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id'
        }
      },
      last_modifier: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id'
        }
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: false
      },
      object: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      documentPath: {
        type: DataTypes.STRING,
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
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('mails');
  }
};