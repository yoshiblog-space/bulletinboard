const jwt = require('jsonwebtoken');
const secretKey = "abcdefg";
const db = require('../models/index');


module.exports = (req, res, next) =>{
  const decoded = jwt.verify(req.headers.token, secretKey);
  db.users.checkAuth(req.headers.userid, decoded.email, decoded.password)
    .then(registUser => {
      if (!registUser) {
        return false;
      } else {
        next();
      }
    })
    .catch((e) => console.error(e))
}