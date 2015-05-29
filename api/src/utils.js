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

var getPaymentsFromDocumentLines = function (docLines) {
  if (docLines.length === 0) {
    return [];
  }

  var lines = docLines.map(function(docLine) {
    return docLine.line;
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

var getManualPaymentsFromDocumentLines = function (manualDocLines) {

  var _manualDocLines = manualDocLines.map(function(m) {
    m.line.id = m.id;
    return m;
  });

  var manualPayments = getPaymentsFromDocumentLines(_manualDocLines);

  return manualPayments.map(function(p) {
    p.manual = true;
    p.id = p.info.lineId + (p.id || '');
    return p;
  });

};

var getArrayFromObject = function(obj) {
  return Object.keys(obj).reduce(function(acc, key) {
      acc.push(obj[key]);
      return acc;
    },
    []
  );
};

var getTodayFormatted = function() {
  var today = new Date();
  return [today.getFullYear(), ('0' + (today.getMonth() + 1)).slice(-2), ('0' + today.getDate()).slice(-2)].join('-');
};

var getCffFromDocumentLines = function(docLines) {
  var lines = docLines.map(function(docLine) {return docLine.line});
  return {
    sourceId: lines[0].sourceId,
    sourceDescription: lines[0].sourceDescription,
    lines: lines.sort(sortCFFLinesByDate),
  };
};

module.exports = {
  parseAuthorization: parseAuthorization,
  getUserByToken: getUserByToken,
  sortCFFLinesByDate: sortCFFLinesByDate,
  getPaymentsFromDocumentLines: getPaymentsFromDocumentLines,
  getManualPaymentsFromDocumentLines: getManualPaymentsFromDocumentLines,
  getArrayFromObject: getArrayFromObject,
  getTodayFormatted: getTodayFormatted,
  getCffFromDocumentLines: getCffFromDocumentLines,
  captchaError: 'captcha',
  passwordError: 'password',
  loginError: 'login',
  unknownError: 'unknown',
  maxAttempts: 2
};