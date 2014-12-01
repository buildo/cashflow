var parseAuthorization = function(authorization) {
  if (!authorization){
    var err = Error("missing authorization header");
    err.statusCode = 401;
    throw err;
  }

  var token = authorization.replace(/Token token=\"([a-z0-9]+)\"/g, '$1');
  return token;
  // this.options.headers["Authorization"] = "Token token=\"" + token + "\"";
};

module.exports = {
  parseAuthorization: parseAuthorization,
};