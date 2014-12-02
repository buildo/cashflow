'use strict';
var ObjectId = require('mongodb').ObjectID;

var parseAuthorization = function(authorization) {
  if (!authorization){
    var err = Error("missing authorization header");
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

module.exports = {
  parseAuthorization: parseAuthorization,
  getUserByToken: getUserByToken
};