'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      models.RefreshToken.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  
  RefreshToken.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdByIp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      revokedAt: {
        type: DataTypes.DATE,
      },
      revokedByIp: {
        type: DataTypes.STRING,
      },
      replacedByToken: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'RefreshToken',
    }
  );
  
  return RefreshToken;
};
