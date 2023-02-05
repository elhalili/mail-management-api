'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inbox extends Model {
    toJSON() {
      return {...this.get(), createdAt: undefined, updatedAt: undefined}
    }
  }

  Inbox.init({
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
    }
  }, {
    sequelize,
    modelName: 'Mail',
    tableName: 'mails'
  });
  
  return Inbox;
};