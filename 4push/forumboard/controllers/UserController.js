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
  db.users.findUser(req.body.email)
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
            token: token,
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
        token: token,
        id: registUser.id
      })
    })
    .catch((e) => console.error(e))
}
//token認証
const doTokenAuth = function (req, res) {
  const decoded = jwt.verify(req.body.token, secretKey);
  db.users.checkUser(decoded.email, decoded.password)
    .then(registUser => {
      if (!registUser) {
        return false;
      }
      db.users.findUser(decoded.email)
        .then(name => {
          return res.json({ name: name })
        })
        .catch((e) => console.error(e))
    })
    .catch((e) => console.error(e))
}


//contentリクエスト
const doRequestContent = function (req, res) {
  const decoded = jwt.verify(req.body.token, secretKey);
  db.users.checkUser(decoded.email, decoded.password)
    .then(registUser => {
      if (!registUser) {
        errMessage = 'AuthError'
        return res.json(errMessage);
      }
      //認証問題なければcontent送信
      db.contents.findAll({
        attributes: ['id', 'title', 'content', 'likes', 'userId'],
        include: {
          model: db.users,
          attributes: ['id', 'name'],
          required: true
        }
      })
        .then(data => {
          return res.json(data);
        })
        .catch((e) => console.error(e))
    })
    .catch((e) => console.error(e))
}
//コンテンツアップデート/新規登録/削除
const doRegistContent = function (req, res) {
  const decoded = jwt.verify(req.body.token, secretKey);
  db.users.checkUser(decoded.email, decoded.password)
    .then(registUser => {
      if (!registUser) {
        errMessage = 'AuthError'
        return res.json(errMessage);
      }
      if (!req.body.id) {
        db.contents.insertContent(req.body.userid, req.body.title, req.body.content)
          .then(registContent => {
            return res.json(registContent);
          })
          .catch((e) => console.error(e))
      } else {
        if (req.body.del) {
          db.contents.destroy({
            where: {
              id: req.body.id
            }
          })
            .then(() => {
              return res.json({ result: 'delComplete' });
            })
            .catch((e) => console.error(e))
        } else {
          db.contents.updateContent(req.body.id, req.body.title, req.body.content)
            .then(updateData => {
              return res.json(updateData);
            })
            .catch((e) => console.error(e))
        }
      }
    })
    .catch((e) => console.error(e))
}

module.exports = {
  defaltPage,
  doRegister,
  doLogin,
  doTokenAuth,
  doRegistContent,
  doRequestContent
}