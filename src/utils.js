'use strict';
var ObjectId = require('mongodb').ObjectID;

var parseAuthorization = function(authorization) {
  if (!authorization){
    var err = Error('missing authorization header');
    err.statusCode = 401;
    throw err;
  }

  var token = authorization.replace(/Token token=\"(.+)\"/g, '$1');
  return token;
};

var getUserByToken = function*(db, token) {
  var session = yield db.sessions.findOne({token: token});
  var user = yield db.users.findOne({_id: ObjectId(String(session.userId))});
  return user;
};

var sortCFFLinesByDate = function (a, b) {
  const dateStringA = a.invoice ? a.invoice.date : a.payments[0].date;
  const dateStringB = b.invoice ? b.invoice.date : b.payments[0].date;
  const dateA = new Date(dateStringA);
  const dateB = new Date(dateStringB);

  return dateB.getTime() - dateA.getTime();
}

module.exports = {
  parseAuthorization: parseAuthorization,
  getUserByToken: getUserByToken,
  sortCFFLinesByDate: sortCFFLinesByDate,
  captchaError: 'captcha',
  passwordError: 'password',
  loginError: 'login',
  unknownError: 'unknown',
  maxAttempts: 2
};