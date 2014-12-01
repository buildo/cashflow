var jsendify = function *jsendify(next){
  try {
    yield* next;
    var ret = {
      status : 'success'
    };

    var objectName = this.objectName;
    var body = this.body;
    if (objectName && 'string' == typeof objectName &&
      body && 'object' == typeof body)  {
      ret.data = {};
      ret.data[objectName] = body;
    }

    this.body = ret;
  } catch (err) {
    this.status = err.statusCode || err.status || 500;
    this.type = 'application/json';
    this.body = {
      status : 'error',
      message : err.message,
      code : err.code || -1,
      statusCode: this.status
    }
    if (this.status == 500) {
      console.error(err.stack);
      this.app.emit('error', err, this);
    }
  }
};

module.exports = function() {
  return jsendify;
};
