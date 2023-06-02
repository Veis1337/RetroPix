const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Picture extends Model {}

Picture.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 14],
      },
    },
    drawingData: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    guestUserId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 100],
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Picture',
    timestamps: true,
  }
);

Picture.associate = (models) => {
  Picture.belongsTo(models.User, { foreignKey: 'userId' });
  Picture.hasMany(models.Comment, { foreignKey: 'pictureId' });
  Picture.hasMany(models.Upvote, { foreignKey: 'pictureId' });
};

module.exports = Picture;
