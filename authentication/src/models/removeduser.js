'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RemovedUser extends Model {
    static associate(models) {}
  }

  RemovedUser.init(
    {
      removedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      removedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      removedByIp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RemovedUser',
      timestamps: true,
    }
  );
  return RemovedUser;
};
