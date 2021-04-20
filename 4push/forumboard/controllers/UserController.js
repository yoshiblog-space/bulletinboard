const db = require('../models/index');
const jwt = require('jsonwebtoken');
const sha256 = require('crypto-js/sha256');
const Base64 = require('crypto-js/enc-base64');
const users = require('../models/users');
//jwt設定値
const secretKey = "abcdefg";
const options = {
  algorithm: 'HS256'
};
//初期ページの設定
const defaltPage = function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
}
//SigninpageのUserCheckとRegister処理
const doRegister = async function (req, res) {
  db.users.findUserEmail(req.body.email)
    .then(registUser => {
      if (registUser) {
        return res.json({ regist: registUser })
      }
      const hashPassword = sha256(req.body.password).toString(Base64);
      db.users.insertUser(req.body.name, req.body.email, hashPassword)
        .then(data => {
          const payload = {
            email: data.email,
            password: data.password,
          };
          const token = jwt.sign(payload, secretKey, options);
          res.json({
            token,
            id: data.id  //useridの返信（メッセージ判別のため）
          })
        })
        .catch((e) => console.error(e))
    })
    .catch((e) => console.error(e))
}
//LoginpageのUser,password CheckとLogin処理
const doLogin = function (req, res) {
  const hashPassword = sha256(req.body.password).toString(Base64);
  db.users.checkUser(req.body.email, hashPassword)
    .then(registUser => {
      if (!registUser) {
        return res.json({ id: registUser })
      }
      const payload = {
        email: req.body.email,
        password: hashPassword,
      };
      const token = jwt.sign(payload, secretKey, options);
      return res.json({
        token,
        id: registUser.id
      })
    })
    .catch((e) => console.error(e))
}
//ユーザー名取得
const doTokenAuth = function (req, res) {
  db.users.findUserId(req.headers.userid)
    .then(name => {
      return res.json({ name })
    })
    .catch((e) => console.error(e))
}
//contentリクエスト
const doRequestContent = async function (req, res) {
  //認証問題なければcontent送信
  const contentdata = await db.contents.findAll({
    attributes: ['id', 'title', 'content', 'userId'],
    //userテーブルと内部結合、likesテーブルと外部結合
    include: [{
      model: db.users,
      attributes: ['id', 'name'],
      required: true,
    }, {
      model: db.likes,
      attributes: ['id', 'contentId', 'userId'],
      required: false
    }],
    order: [['id', 'ASC']]
  })
    .then(data => {
      return res.json(data);
    })
    .catch((e) => console.error(e))
}
//コンテンツ新規登録
const doRegistContent = function (req, res) {
  db.contents.insertContent(req.headers.userid, req.body.title, req.body.content)
    .then(registContent => {
      return res.json(registContent);
    })
    .catch((e) => console.error(e))
}
//コンテンツ削除
const doDeleteContent = function (req, res) {
  db.contents.destroy({
    where: {
      id: req.body.id
    }
  })
    .then(() => {
      return res.json({ result: 'delComplete' });
    })
    .catch((e) => console.error(e))
}
//コンテンツアップデート
const doUpdateContent = function (req, res) {
  db.contents.updateContent(req.body.id, req.body.title, req.body.content)
    .then(updateData => {
      return res.json(updateData);
    })
    .catch((e) => console.error(e))
}

const doDelLike = function (req, res) {
  db.likes.destroy({
    where: {
      id: req.body.id
    }
  })
    .then(() => {
      return res.json({ likesState: 0 });
    })
}
const doAddLike = function (req, res) {
  db.likes.insertLikes(req.headers.userid, req.body.contentId)
    .then(data => {
      return res.json({likesState:1,id:data});
    })
    .catch((e) => console.error(e))
}

module.exports = {
  defaltPage,
  doRegister,
  doLogin,
  doTokenAuth,
  doRegistContent,
  doRequestContent,
  doDeleteContent,
  doUpdateContent,
  doDelLike,
  doAddLike
}