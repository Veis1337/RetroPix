const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'Comment',
    timestamps: true,
  }
);

Comment.associate = (models) => {
  Comment.belongsTo(models.User, { foreignKey: 'userId' });
  Comment.belongsTo(models.Picture, { foreignKey: 'pictureId' });
};

module.exports = Comment;
