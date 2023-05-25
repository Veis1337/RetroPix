const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    friendList: {
      type: DataTypes.ARRAY(DataTypes.UUID),
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
  }
);

module.exports = User;
