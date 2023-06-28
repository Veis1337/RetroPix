const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Bot extends Model {}

Bot.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    responsePrompt: {
      type: DataTypes.STRING(4000), // Update the data type and set the max length to 4000 characters
      allowNull: false,
    },
    personality: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.TEXT, // Assuming the avatar is stored as a URL to an image
      allowNull: true,
    },
    firstMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Bot',
    timestamps: true,
  }
);

module.exports = Bot;
