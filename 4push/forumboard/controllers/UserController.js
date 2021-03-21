const findOption = require('../models/User');
const jwt = require('jsonwebtoken');
const sha256 = require('crypto-js/sha256');
const Base64 = require('crypto-js/enc-base64');
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
const doRegister = function (req, res) {
  findOption.findUser(req.body.email)
    .then(registUser => {
      if (registUser) {
        return res.json({ regist: registUser })
      }
      const hashPassword = sha256(req.body.password).toString(Base64);
      findOption.insertUser(req.body.name, req.body.email, hashPassword)
        .then(data => {
          const payload = {
            email: data.email,
            password: data.password,
          };
          const token = jwt.sign(payload, secretKey, options);
          res.json({ token: token })
        })
        .catch((e) => console.error(e))
    })
    .catch((e) => console.error(e))
}
//LoginpageのUser,password CheckとLogin処理
const doLogin = function (req, res) {
  const hashPassword = sha256(req.body.password).toString(Base64);
  findOption.checkUser(req.body.email, hashPassword)
    .then(registUser => {
      if (!registUser) {
        return res.json({ regist: registUser })
      }
      const payload = {
        email: req.body.email,
        password: hashPassword,
      };
      const token = jwt.sign(payload, secretKey, options);
      res.json({ token: token })
    })
    .catch((e) => console.error(e))
}
//token認証
const doTokenAuth = function (req, res){
  const decoded = jwt.verify(req.body.authtoken, secretKey);
  findOption.checkUser(decoded.email, decoded.password)
    .then(registUser => {
      if (!registUser) {
        return false;
      }
      findOption.findUser(decoded.email)
        .then(name => {
          return res.json({ name: name })
        })
        .catch((e) => console.error(e))
    })
    .catch((e) => console.error(e))
}

module.exports = {
  defaltPage,
  doRegister,
  doLogin,
  doTokenAuth
}