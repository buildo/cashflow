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
var randtoken = require('rand-token');
var passwordHash = require('password-hash');
var scrapers = require('./src/scrapers.js');
var jsendify = require('./src/jsendify.js');
var utils = require('./src/utils.js');
var saveOnFattureInCloud = require('cff-manager-assistant').saveOnFattureInCloud;
var db;

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

// USERS
// signup
app.post('/users', function *() {
  var email = this.request.body.email;
  var password = this.request.body.password;

  if (!email || !password) {
    this.throw(400, 'email and password must be set in request body');
  }
  var user = yield db.users.findOne({'credentials.login.email': email});
  if(user){
    // error
    this.throw(400, 'user already exists');
  } else {
    var newUser = {
      credentials: {
        login: {
          email: email,
          password: passwordHash.generate(password)
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
  var user = yield db.users.findOne({'credentials.login.email': email});

  if (!user) {
    this.throw(400, 'user does not exists');
  }
  if (!passwordHash.verify(password, user.credentials.login.password)) {
    this.throw(400, 'wrong password');
  }

  var token = randtoken.generate(16);
  yield db.sessions.update({userId: user._id}, {userId: user._id, token: token}, {upsert: true});
  this.objectName = 'credentials';
  this.body = {token: token};
});

app.get('/users/me', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  console.log('token', token);
  var user = yield utils.getUserByToken(db, token);
  console.log(user);
  this.objectName = 'user';
  this.body = {user: user};
});

// CREDENTIALS
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
  yield db.users.update({_id: user._id}, {$set: {'credentials.fattureincloud': {email: email, password: password}}});
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
  yield db.users.update({_id: user._id}, {$set: {'credentials.bank': {id:bankId, user: bankUserId, password: password}}});
});

// CFFS
app.get('/cffs/main', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  if (!userMainCFF) {
    this.throw(400, 'user does not have a database');
  }

  var linesKeys = Object.keys(userMainCFF.cff.lines);
  var stagedLinesKeys = Object.keys(userMainCFF.cff.stagedLines);
  var stagedLines = stagedLinesKeys.reduce(function(acc, key) {
    acc.push(userMainCFF.cff.stagedLines[key]);
    return acc;
  }, []);
  var lines = linesKeys.reduce(function(acc, key) {
    acc.push(userMainCFF.cff.lines[key]);
    return acc;
  }, []);

  var correctCFF = {
    sourceId: userMainCFF.cff.sourceId,
    sourceDescription: userMainCFF.cff.sourceDescription,
    lines: lines,
    stagedLines: stagedLines
  };

  this.objectName = 'cffs';
  this.body = { main: userMainCFF.cff};
});

app.post('/cffs/main/pull', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  // fai partire scrapers, aggiorna.
  var credentialsFattureInCloud = user.credentials.fattureincloud;
  if (!credentialsFattureInCloud) {
    this.throw(400, 'fattureincloud credentials not found');
  }
  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  var oldCFF = {};
  if (userMainCFF) {
    oldCFF = userMainCFF.cff;
    var stagedLines = oldCFF.stagedLines || [];
    if (Object.keys(stagedLines).length > 0) {
      this.throw(400, 'staged are is not empty');
    }
    var keys = Object.keys(oldCFF.lines);
    var oldLines = keys.reduce(function(acc, key) {
      acc.push(userMainCFF.cff.lines[key]);
      return acc;
    }, []);
    oldCFF.lines = oldLines;
  }

  var result = yield scrapers.getFattureInCloud(credentialsFattureInCloud, oldCFF);
  // transform lines from Array to Object
  var newObjectLines = result.fattureInCloud.cff.lines.reduce(function(acc, line) {
      acc[line.id] = line;
      return acc;
    },
    {}
  );

  var newCFF = {
    sourceId: result.fattureInCloud.cff.sourceId,
    sourceDescription: result.fattureInCloud.cff.sourceDescription,
    lines: newObjectLines,
    stagedLines: {}
  };
  // save modified CFF to db
  yield db.cffs.update({userId: user._id, type: 'main'}, {$set: {cff: newCFF}}, {upsert: true});

  // return correct CFF with lines as array
  // add stagedLines field
  result.fattureInCloud.cff.stagedLines = [];
  this.objectName = 'cffs';
  this.body = { main: result.fattureInCloud.cff || {} };
});

app.get('/cffs/main/stage', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  var keys = Object.keys(userMainCFF.cff.stagedLines);
  var stagedLines = keys.reduce(function(acc, key) {
    acc.push(userMainCFF.cff.stagedLines[key]);
    return acc;
  }, []);
  this.objectName = 'stagedLines';
  this.body = { lines: stagedLines};
});

app.post('/cffs/main/stage/clear', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  userMainCFF.cff.stagedLines = {};
  yield db.cffs.update({userId: user._id, type: 'main'}, {$set: {cff:userMainCFF.cff}});
});

app.get('/cffs/main/stage/:lineId', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var stageLineId = this.params.lineId;
  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  if (!userMainCFF.cff.stagedLines[stageLineId]) {
    this.throw(400, 'the given id does not correspond to any staged line');
  }
  this.objectName = 'stagedLine';
  this.body = { line: userMainCFF.cff.stagedLines[stageLineId] };
});

app.put('/cffs/main/stage/:lineId/payment', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var stageLineId = this.params.lineId;
  var payment = this.request.body;

  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  if (!userMainCFF) {
    this.throw(400, 'user does not have a database');
  }
  if (!userMainCFF.cff.lines[stageLineId]) {
    this.throw(400, 'the given id does not correspond to any line');
  }
  var stagedLines = userMainCFF.cff.stagedLines;
  if (!stagedLines[stageLineId]) {
    // line does not exist yet in the staging area
    var line = {
      id: stageLineId,
      flowDirection: payment.info.flowDirection,
      payments: [payment]
    };
    stagedLines[stageLineId] = line;
  } else {
    // line already exists -> check if payment is not already stored, then store it
    var filteredPayments = stagedLines[stageLineId].payments.filter(function(_payment) {
      return _payment.scraperInfo.tranId === payment.scraperInfo.tranId;
    });
    if (filteredPayments.length > 0) {
      this.throw(400, 'payment already stored in the staging area');
    }
    stagedLines[stageLineId].payments.push(payment);
  }
  var setModifier = {$set:{}};
  setModifier.$set['cff.stagedLines.' + stageLineId] = userMainCFF.cff.lines[stageLineId];
  yield db.cffs.update({userId: user._id, type: 'main'}, setModifier);
});

app.get('/cffs/bank', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var refresh = this.query.refresh;
  var body = {};
  var userBankCFF = yield db.cffs.findOne({userId: user._id, type: 'bank'});
  this.objectName = 'bank';
  this.body = {cff: userBankCFF.cff || {}};
});

app.post('/cffs/bank/pull', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var refresh = this.query.refresh;
  var body = {};
  // fai partire scrapers, aggiorna.
  var credentialsBank = user.credentials.bank;
  if (!credentialsBank) {
    this.throw(400, 'bank credentials not found');
  }
  var validResponse = false;
  var result;
  var attempts = 0;
  while (!validResponse && attempts < 5) {
    result = yield scrapers.getBank(credentialsBank);
    validResponse = typeof result.bank.error === 'undefined';
    attempts += 1;
  }
  if (!validResponse) {
    this.throw(500, 'reached maximum number of attempts (' + attempts + ')');
  }
  body.attempts = attempts;
  // transform lines from Array to Object
  var newObjectLines = result.bank.cff.lines.reduce(function(acc, line) {
      acc[line.id] = line;
      return acc;
    },
    {}
  );
  result.bank.cff.lines = newObjectLines;
  yield db.cffs.update({userId: user._id, type: 'bank'}, {$set: {cff:result.bank.cff}}, {upsert: true});

  var userBankCFF = yield db.cffs.findOne({userId: user._id});
  this.objectName = 'bank';
  body.cff = userBankCFF.cff || {};
  this.body = body;
});

app.post('/cffs/main/commit', function*() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var credentialsFattureInCloud = user.credentials.fattureincloud;
  if (!credentialsFattureInCloud) {
    this.throw(400, 'fattureincloud credentials not found');
  }
  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  var keys = Object.keys(userMainCFF.cff.stagedLines);
  var stagedLines = keys.reduce(function(acc, key) {
    acc.push(userMainCFF.cff.stagedLines[key]);
    return acc;
  }, []);

  if (stagedLines.length === 0) {
    this.throw(400, 'staged are is empty');
  }

  // add payments of same line not staged
  stagedLines.map(function (stagedLine) {
    var paymentsIDs = stagedLine.payments.reduce(function (acc, _payment) {
      acc += ';' + _payment.scraperInfo.tranId;
      return acc;
    }, '');

    userMainCFF.cff.lines[stagedLine.id].payments.forEach(function(_payment) {
      if (paymentsIDs.indexOf(_payment.scraperInfo.tranId) === -1) {
        stagedLine.payments.push(_payment);
      }
    });
  });

  const result = yield saveOnFattureInCloud(stagedLines, credentialsFattureInCloud);
  if (result.error) {
    this.throw(500, 'upload to fatture in cloud failed');
  }
  result.forEach(function(res) {
    if (res.newId !== res.oldId) {
      userMainCFF.cff.lines[res.oldId].id = res.newId;
      userMainCFF.cff.lines[res.newId] = userMainCFF.cff.lines[res.oldId];
      delete userMainCFF.cff.lines[res.oldId];
    }
  });
  userMainCFF.cff.stagedLines = {};
  yield db.cffs.update({userId: user._id, type: 'main'}, {$set: {cff: userMainCFF.cff}});
});

app.get('/projects', function *() {
  //
});

app.get('/resources', function *() {
  //
});

app.listen(9000);

