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
};

var getPaymentsFromCFF = function (cff) {
  if (!cff) {
    return [];
  }

  if (!Array.isArray(cff.lines)) {
    cff.lines = Object.keys(cff.lines).reduce(function(acc, key) {
        acc.push(cff.lines[key]);
        return acc;
      },
      []
    );
  }

  var lines = cff.lines.map(function(line) {
    line.sourceId = cff.sourceId;
    return line;
  });

  var payments = lines.map(function(line, index) {
    var info = Object.keys(line).reduce(function(acc, key) {
        if (key !== 'payments') {

          acc[key === 'id' ? 'lineId' : key] = line[key];
        }
        return acc;
      },
      {}
    );
    return line.payments.map(function(payment) {
      payment.info = info;
      return payment;
    });
  });

  return [].concat.apply([], payments);
};

var getArrayFromObject = function(obj) {
  return Object.keys(obj).reduce(function(acc, key) {
      acc.push(obj[key]);
      return acc;
    },
    []
  );
}


module.exports = {
  parseAuthorization: parseAuthorization,
  getUserByToken: getUserByToken,
  sortCFFLinesByDate: sortCFFLinesByDate,
  getPaymentsFromCFF: getPaymentsFromCFF,
  getArrayFromObject: getArrayFromObject,
  captchaError: 'captcha',
  passwordError: 'password',
  loginError: 'login',
  unknownError: 'unknown',
  maxAttempts: 2
};