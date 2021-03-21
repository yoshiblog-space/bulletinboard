const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_ROOT_USER, process.env.MYSQL_ROOT_PASSWORD, {
  host: 'db',
  dialect: 'mysql',
  port: 3306,
})
const Model = Sequelize.Model;
const users = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
}, {
  // タイムスタンプの属性 (updatedAt, createdAt) が不要ならば次のプロパティは false
  timestamps: false,
  // テーブル名を変更したくない場合は次のプロパティを true
  // デフォルトでは sequelize はテーブル名を複数形に変更する
  freezeTableName: true
});
const findUser = async function (email) {
  const result = await users.findOne({ where: { email: email } });
  if (result === null) {
    return false;
  }
  return result.name;
}

const checkUser = async function (email, password) {
  const checkresult = await users.findOne({ where: { email: email, password: password } });
  if (checkresult === null) {
    return false;
  }
  return checkresult instanceof users;
}

const insertUser = async function (name, email, password) {
  const regist = await users.create({ name: name, email: email, password: password })
  .catch((e) => console.error(e));
  return regist
}

module.exports = {
  findAllData() {
    return users.findAll()
  },
  findUser,
  checkUser,
  insertUser,
}