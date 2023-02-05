'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Region extends Model {

    toJSON() {
      return {...this.get(), updatedAt: undefined, createdAt: undefined};
    }
  }
  Region.init({
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Region',
    tableName: 'regions'
  });
  return Region;
};