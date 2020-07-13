'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SignupInvitation extends Model {
    static associate(models) {
      models.SignupInvitation.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  
  SignupInvitation.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isOpened: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      accountCreated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'SignupInvitation',
      timestamps: true,
    }
  );
  return SignupInvitation;
};
