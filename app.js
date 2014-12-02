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
var scrapers = require('./src/scrapers.js');
var jsendify = require('./src/jsendify.js');
var utils = require('./src/utils.js');
var db;

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
});


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
      credentials: {
        login: {
          email: email,
          password: password
        },
      }
    };
    yield db.users.insert(newUser);
  }
});

// login
app.post('/login', function* () {
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
    var body = {email : email, password : password};
  // var response = yield this.r.post([{
  //   url : ENDPOINT + '/login',
  //   body : body
  // }]);
    console.log('logged', user._id);
    this.objectName = 'credentials';
    var token = 'asjdhuhhcsio';

    yield db.sessions.update({userId: user._id}, {userId: user._id, token: token}, {upsert: true});
    this.body = {token: token};
  }
});

app.get('/users/me', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  console.log('token', token);
  var user = yield utils.getUserByToken(db, token);
  console.log(user);
  this.objectName = 'user';
  this.body = {user: user};
});

app.post('/users/credentials/fattureincloud', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var email = this.request.body.email;
  var password = this.request.body.password;

  if (!email || !password) {
    this.throw(400, 'email, and password must be set in request body');
  }

  if(!user){
    // error
  }
  yield db.users.update({_id: user._id}, {$set: {"credentials.fattureincloud": {email: email, password: password}}});
});

app.post('/users/credentials/bank', function *(next) {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var bankId = this.request.body.bankId;
  var bankUserId = this.request.body.bankUserId;
  var password = this.request.body.password;

  if (!bankUserId || !password) {
    this.throw(400, 'email, and password must be set in request body');
  }

  if(!user){
    // error
  }
  yield db.users.update({_id: user._id}, {$set: {"credentials.bank": {id:bankId, user: bankUserId, password: password}}});
});

app.get('/cffs/main', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var refresh = this.query.refresh;
  var userCFFs;

  if (refresh) {
    // fai partire scrapers, aggiorna.
    var credentialsFattureInCloud = user.credentials.fattureincloud;
    if (!credentialsFattureInCloud) {
      this.throw(400, 'fattureincloud credentials not found');
    }
    userCFFs = yield db.cffs.findOne({userId: user._id});
    var oldCFF = userCFFs && userCFFs.main ? userCFFs.main : {};
    var result = yield scrapers.getFattureInCloud(credentialsFattureInCloud, oldCFF);
    yield db.cffs.update({userId: user._id}, {$set: {main:result.fattureInCloud.cff}}, {upsert: true});
  }
  userCFFs = yield db.cffs.findOne({userId: user._id});
  this.objectName = 'cffs';
  this.body = { main: userCFFs.main || {} };
});

app.get('/cffs/bank', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var refresh = this.query.refresh;
  var userCFFs;

  if (refresh) {
    // fai partire scrapers, aggiorna.
    var credentialsBank = user.credentials.bank;
    if (!credentialsBank) {
      this.throw(400, 'bank credentials not found');
    }
    userCFFs = yield db.cffs.findOne({userId: user._id});
    var validResponse = false;
    var result;
    while (!validResponse) {
      result = yield scrapers.getBank(credentialsBank);
      validResponse = typeof result.bank.error === 'undefined';
      console.log(validResponse);
    }
    yield db.cffs.update({userId: user._id}, {$set: {bank:result.bank.cff}}, {upsert: true});
  }
  userCFFs = yield db.cffs.findOne({userId: user._id});
  this.objectName = 'cffs';
  this.body = { bank: userCFFs.bank || {} };
});

app.get('/projects', function *() {
  this.r.parseAuthorization(this.request.header.authorization);

});

app.post('/resources', function *() {
  //
});

app.listen(9000);

