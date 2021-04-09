'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    //if Write fucntion this script...
    static async findUser(email) {
      const result = await this.findOne({ where: { email: email } });
      if (!result) {
        return false;
      }
      return result.name;
    }
    static async checkUser(email, password) {
      const checkresult = await this.findOne({ where: { email: email, password: password } });
      return checkresult;
    }
    
    static async insertUser(name, email, password) {
      const regist = await this.create({ name: name, email: email, password: password })
        .catch((e) => console.error(e));
      return regist;
    }

    static associate(models) {
      // define association here
      this.hasMany(models.contents, {
        foreignKey: 'userId',
        sourceKey: 'id',
        onDelete: 'cascade',
        hooks: true,
        allowNull: false
      });
    }
  };

  users.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
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
    modelName: 'users',
  });
  return users;
};