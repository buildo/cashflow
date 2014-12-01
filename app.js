'use strict';

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var comongo = require('co-mongo');
var co = require('co');
var koa = require('koa');
var app = koa();
var router = require('koa-router');
var bodyParser = require('koa-body-parser');
var compress = require('koa-compress');
var jsendify = require('./src/jsendify.js');
var utils = require('./src/utils.js');
var db;

var ENDPOINT = ''; // 'http://' + config.BACKEND_ENDPOINT + ':' + config.BACKEND_ENDPOINT_PORT;
var mongoURL = 'mongodb://localhost:27017/cashflow';


// init router to use app.get()
app.use(compress());
app.use(jsendify());
app.use(bodyParser());
app.use(router(app));


comongo.configure({
    host: 'localhost',
    port: 27017,
    name: 'cashflow',
    pool: 10,
    collections: ['users', 'cffs', 'projects', 'resources', 'sessions']
});

// init db
co(function *() {
  db = yield comongo.get();
})();


app.get('/test', function *() {
  this.objectName = 'test';
  this.body = {test: 'ciao'};
});

// USERS
// signup
app.post('/users', function *() {
  var email = this.request.body.email;
  var password = this.request.body.password;

  if (!email || !password) {
    // this.throw(400, 'email, password and laboratoryId must be set in request body');
  }
  var user = yield db.users.findOne({'login.email': email});
  console.log(user);
  if(user){
    // error
    console.log('user already exists');
    this.throw(400, 'user already exists');
  } else {
    var newUser = {
      login: {
        email: email,
        password: password
      },
      credentials: {}
    };
    yield db.users.insert(newUser);
  }
});

// login
app.post('/login', function* () {
  console.log(this.request.body);
  var email = this.request.body.email;
  var password = this.request.body.password;

  if (!email || !password) {
    this.throw(400, 'email and password must be set in request body');
  }
  var user = yield db.users.findOne(
    {
      login: {
        email: email,
        password: password
      }
    });

  if (!user) {
    // error, no user
    console.log('user does not exists');
    this.throw(400, 'user does not exists');
  } else {
    var body = { email : email, password : password};
  // var response = yield this.r.post([{
  //   url : ENDPOINT + '/login',
  //   body : body
  // }]);
    console.log('logged', user._id);
    this.objectName = 'credentials';
    var token = 'asjdhuhhcsio';

    yield db.sessions.update({userId: user['_id']}, {userId: user._id, token: token}, {upsert: true});
    this.body = {token: token};
  }
});

app.get('/users/me', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  console.log('token', token);
  var session = yield db.sessions.findOne({token: token});
  console.log('userID', session.userId);
  var user = yield db.users.findOne({_id: ObjectId(String(session.userId))});
  console.log(user);
  this.objectName = 'user';
  this.body = {user: user};
});

app.post('users/credentials/fattureincloud', function *(next) {
  //
});

app.post('users/credentials/bank', function *(next) {
  //
});

app.get('/cffs/main/:refresh', function *() {
  this.r.parseAuthorization(this.request.header.authorization);
  var userId = ''; // get userId with authorization token
  var refresh = this.params.refresh;

  if (refresh) {
    // fai partire scrapers, aggiorna.
  }
  var mainCFF = mongo.cffs.findOne({userId: userId}).cffs.main;


});

app.get('/cffs/bank/:refresh', function *() {
  this.r.parseAuthorization(this.request.header.authorization);
  var userId = ''; // get userId with authorization token
  var refresh = this.params.refresh;

  if (refresh) {
    // fai partire scrapers, aggiorna.
  }
  var mainCFF = mongo.cffs.findOne({userId: userId}).cffs.main;


});

app.get('/projects', function *() {
  this.r.parseAuthorization(this.request.header.authorization);

});

app.post('/resources', function *() {
  //
});

app.listen(9000);



