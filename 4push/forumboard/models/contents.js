'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async insertContent(id, title, content) {
      const registContent = await this.create({ userId: id, title: title, content: content })
        .catch((e) => console.error(e));
      return registContent;
    }
    static async updateContent(id, title, content) {
      const doUpdate = await this.update({ title, content }, { where: { id } })
        .catch((e) => console.error(e));
        return doUpdate;
    }
    static associate(models) {
      // define association here
      this.belongsTo(models.users)
      this.hasMany(models.likes, {
        foreignKey: 'contentId',
        sourceKey: 'id',
        onDelete: 'cascade',
        foreignKey: "contentId",
        allowNull: false
      })
    }
  };
  contents.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'users',
        key: 'id',
        as: 'userId',
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'contents',
    freezeTableName: true
  });
  return contents;
};