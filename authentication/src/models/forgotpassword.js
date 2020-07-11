'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ForgotPassword extends Model {
    static associate(models) {
      models.ForgotPassword.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }

  ForgotPassword.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ForgotPassword',
      timestamps: true,
    }
  );
  return ForgotPassword;
};
