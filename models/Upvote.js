const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Upvote extends Model {}

Upvote.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    pictureId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Pictures',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Upvote',
    timestamps: true,
  }
);

Upvote.associate = (models) => {
  Upvote.belongsTo(models.User, { foreignKey: 'userId' });
  Upvote.belongsTo(models.Picture, { foreignKey: 'pictureId' });
};

module.exports = Upvote;
