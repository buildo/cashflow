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
var getMatches = require('cff-manager-assistant').getMatches;
var db;

var HOST = 'francesco-air.local';

// init router to use app.get()
app.use(compress());
app.use(jsendify());
app.use(bodyParser());

//FIXME: CORS need to be better configured
app.use(function *(next) {
  if (app.env === 'development') {
    this.set('Access-Control-Allow-Origin', '*');
    this.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Override-Status-Code');
    this.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  }
  yield next;
});

app.use(router(app));

comongo.configure({
  host: HOST,
  port: 27017,
  name: 'cashflow',
  pool: 10,
  collections: ['users', 'cffs', 'projects', 'resources', 'sessions', 'progresses', 'bankSessions', 'matches', 'stagedMatches']
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
  var user = yield utils.getUserByToken(db, token);
  this.objectName = 'user';
  var body = {
    _id: user._id,
    email: user.credentials.login.email
  };
  this.body = body;
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
    this.throw(400, 'user does not have a main cff in database');
  }

  var lines = utils.getArrayFromObject(userMainCFF.cff.lines);
  var stagedLines = utils.getArrayFromObject(userMainCFF.cff.stagedLines);

  var correctCFF = {
    sourceId: userMainCFF.cff.sourceId,
    sourceDescription: userMainCFF.cff.sourceDescription,
    lines: lines.sort(utils.sortCFFLinesByDate),
    stagedLines: stagedLines
  };

  this.objectName = 'cffs';
  this.body = { main: correctCFF};
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
    var stagedLines = oldCFF.stagedLines || {};
    if (utils.getArrayFromObject(stagedLines).length > 0) {
      this.throw(400, 'staged are is not empty');
    }
    var oldLines = utils.getArrayFromObject(userMainCFF.cff.lines);
    oldCFF.lines = oldLines;
  }

  scrapers.getFattureInCloud(db, user._id, credentialsFattureInCloud, oldCFF)
    .done(function(result) {
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
      co(function *() {
        var matches = yield db.matches.findOne({userId: user._id});
        // remove matches of no longer existing lines
        if (matches) {
          var matchesLinesIDs = Object.keys(matches);
          var newCFFLinesIDs = Object.keys(newObjectLines);

          matchesLinesIDs.reduce(function(acc, matchLineID) {
              if (newCFFLinesIDs.indexOf(matchLineID) > -1) {
                acc[matchLineID] = matches[matchLineID];
              }
              return acc;
            },
            {}
          );
          yield db.matches.update({userId: user._id}, {$set: matches});
        }
        // replace mainCFF with new one
        yield db.cffs.update({userId: user._id, type: 'main'}, {$set: {cff: newCFF}}, {upsert: true});
      });
    });
});

app.get('/cffs/main/pull/progress', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var fattureInCloudProgress = yield db.progresses.findOne({userId: user._id, type: 'fattureincloud'});
  this.objectName = 'progress';
  this.body = fattureInCloudProgress;
});

app.get('/cffs/main/stage', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  var stagedLines = userMainCFF ? utils.getArrayFromObject(userMainCFF.cff.stagedLines) : [];
  this.objectName = 'stagedLines';
  this.body = stagedLines;
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
  this.body = userMainCFF.cff.stagedLines[stageLineId];
});

app.get('/cffs/bank', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var userBankCFF = yield db.cffs.findOne({userId: user._id, type: 'bank'});
  if (!userBankCFF) {
    this.throw(400, 'user does not have a bank cff in database');
  }
  var sortedLines = userBankCFF.cff.lines.sort(utils.sortCFFLinesByDate);

  this.objectName = 'cffs'
  this.body = {bank: userBankCFF.cff || {}};
});

app.post('/cffs/bank/pull', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var captcha = this.query.captcha;
  var inputParameters = {
    cff: true
  };

  if (captcha) {
    var bankSession = yield db.bankSessions.findOne({userId: user._id, type: 'bper'});
    inputParameters.captcha = captcha;
    inputParameters.cookies = bankSession.cookies;
    console.log(captcha, bankSession.cookies);
  }
  // fai partire scrapers, aggiorna.
  var credentialsBank = user.credentials.bank;
  if (!credentialsBank) {
    this.throw(400, 'bank credentials not found');
  }
  var status = 'trying';
  var result;
  var attempts = 0;
  while (status === 'trying') {
    result = yield scrapers.getBank(credentialsBank, inputParameters);
    attempts += 1;
    status = result.bank.status.name === utils.unknownError && attempts < utils.maxAttempts ? 'trying' : result.bank.status.name;
  }

  // console.log(status);

  switch (status) {
    case 'success':
      console.log(result);

      // retrieve stored lines
      var userBankCFF = yield db.cffs.findOne({userId: user._id, type: 'bank'});
      var oldLines = userBankCFF && userBankCFF.cff.lines ? userBankCFF.cff.lines : [];

      var filteredOldLines = [];
      if (oldLines.length > 0) {
        var closestDateOldLines = oldLines.map(function(line){return line.payments[0].date;})
          .reduce(function(acc, date){return date < acc ? date : acc;});

        filteredOldLines = oldLines.filter(function(line){return line.payments[0].date < closestDateOldLines});
      }

      var filteredNewLines = result.bank.cff.lines.filter(function(line){return !closestDateOldLines || line.payments[0].date >= closestDateOldLines});

      // merge old lines with newly downloaded ones
      var lines = filteredOldLines.concat(filteredNewLines);
      result.bank.cff.lines = lines;

      yield db.cffs.update({userId: user._id, type: 'bank'}, {$set: {cff:result.bank.cff}}, {upsert: true});
      break;

    case utils.unknownError:
      this.throw(400, 'reached maximum number of attempts (' + attempts + ')');
      break;

    case utils.captchaError:
      yield db.bankSessions.update({userId: user._id, type: 'bper'}, {$set: {cookies: result.bank.cookies}}, {upsert: true});
      this.objectName = 'captcha';
      console.log(result.bank.captcha);
      var b = new Buffer(result.bank.captcha);
      this.body = {captcha: b.toString('base64')};
      break;

    case utils.passwordError:
      yield db.users.update({_id: user._id}, {$set: {'credentials.bank': {}}});
      this.throw(400, result.bank.status.message);
      break;

    default:
      this.throw(400, result.bank.status.message);
  }
});

app.post('/cffs/main/commit', function*() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var credentialsFattureInCloud = user.credentials.fattureincloud;
  if (!credentialsFattureInCloud) {
    this.throw(400, 'fattureincloud credentials not found');
  }
  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  if (!userMainCFF) {
    this.throw(400, 'main cff not found in database');
  }

  var stagedLines = utils.getArrayFromObject(userMainCFF.cff.stagedLines)

  if (stagedLines.length === 0) {
    this.throw(400, 'staged area is empty');
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

app.get('/matches/todo', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var matches = yield db.matches.findOne({userId: user._id});
  matches = matches || [];
  var userPaymentsIDs = matches.map(function(match) {return match.main.id});
  var dataPaymentsIDs = matches.map(function(match) {return match.data.id});

  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  var userBankCFF = yield db.cffs.findOne({userId: user._id, type: 'bank'});

  var userPayments = utils.getPaymentsFromCFF(userMainCFF.cff);
  var dataPayments = utils.getPaymentsFromCFF(userBankCFF.cff);

  var filteredUserPayments = userPayments.filter(function(userPayment) {
    return userPaymentsIDs.indexOf(userPayment.id) === -1;
  });

  var filteredDataPayments = dataPayments.filter(function(dataPayment) {
    return dataPaymentsIDs.indexOf(dataPayment.id) === -1;
  });

  var payments = {
    data: dataPayments,
    main: userPayments
  };

  this.objectName = 'matches';
  this.body = {
    todo: getMatches(payments)
  };
});

app.get('/matches/done', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var matches = yield db.matches.findOne({userId: user._id});

  this.objectName = 'matches';
  this.body = matches || [];
});

app.put('/matches/stage', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var match = this.request.body;
  var stageLineId = match.main.info.lineId;

  // update stagedLines
  var mainPayment = match.main;

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
      flowDirection: mainPayment.info.flowDirection,
      payments: [mainPayment]
    };
    stagedLines[stageLineId] = line;
  } else {
    // line already exists -> check if mainPayment is not already stored, then store it
    var filteredPayments = stagedLines[stageLineId].payments.filter(function(_payment) {
      return _payment.scraperInfo.tranId === mainPayment.scraperInfo.tranId;
    });
    if (filteredPayments.length > 0) {
      this.throw(400, 'payment already stored in the staging area');
    }
    stagedLines[stageLineId].payments.push(mainPayment);
  }
  var setModifier = {$set:{}};
  setModifier.$set['cff.stagedLines.' + stageLineId] = userMainCFF.cff.lines[stageLineId];
  yield db.cffs.update({userId: user._id, type: 'main'}, setModifier);

  // update stagedMatches
  var stagedMatches = yield db.stagedMatches.findOne({userId: user._id});
  var setModifier = {$set:{}};
  setModifier.$set[mainPayment.id] = match;
  yield db.stagedMatches.update({userId: user._id}, setModifier, {upsert: true});
});

app.get('/projects', function *() {
  //
});

app.get('/resources', function *() {
  //
});

app.listen(9000);

