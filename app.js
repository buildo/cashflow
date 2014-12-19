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
    this.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
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

app.get('/cffs/bank', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var userBankCFF = yield db.cffs.findOne({userId: user._id, type: 'bank'});
  if (!userBankCFF) {
    this.throw(400, 'user does not have a bank cff in database');
  }
  var sortedLines = userBankCFF.cff.lines.sort(utils.sortCFFLinesByDate);

  this.objectName = 'cffs';
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

        filteredOldLines = oldLines.filter(function(line){return line.payments[0].date < closestDateOldLines;});
      }

      var filteredNewLines = result.bank.cff.lines.filter(function(line){return !closestDateOldLines || line.payments[0].date >= closestDateOldLines;});

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

  var stagedMatchesDB = yield db.stagedMatches.findOne({userId: user._id});
  var stagedMatches = utils.getArrayFromObject(stagedMatchesDB.stagedMatches);
  if (stagedMatches.length === 0) {
    this.throw(400, 'stage area is empty');
  }

  var credentialsFattureInCloud = user.credentials.fattureincloud;
  if (!credentialsFattureInCloud) {
    this.throw(400, 'fattureincloud credentials not found');
  }

  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  var userBankCFF = yield db.cffs.findOne({userId: user._id, type: 'bank'});

  var payments = utils.getPaymentsFromCFF(userMainCFF.cff).concat(utils.getPaymentsFromCFF(userBankCFF.cff));
  var paymentsMap = payments.reduce(function(acc, payment) {
      acc[payment.id] = payment;
      return acc;
    },
    {}
  );

  var stagedPayments = stagedMatches.filter(function(match) {
    return !(paymentsMap[match.main].date === paymentsMap[match.data].date &&
      (paymentsMap[match.main].grossAmount - paymentsMap[match.data].grossAmount) < 0.01);
  }).map(function(match) {return paymentsMap[match.main]});

  var stagedLines = stagedPayments.reduce(function(acc, payment) {
      if (!acc[payment.info.lineId]) {
        const newLine = payment.info;
        newLine.id = newLine.lineId;
        newLine.payments = [payment];
        acc[newLine.id] = newLine;
      } else {
        acc[payment.info.lineId].payments.push(payment);
      }
      return acc;
    },
    {}
  );

  console.log(userMainCFF.cff.lines);

  var stagedPaymentsIDs = stagedPayments.reduce(function(acc, payment) {return acc + payment.id}, '');

  // add stagedPayments of same line not staged
  stagedLines = utils.getArrayFromObject(stagedLines).map(function (stagedLine) {
    userMainCFF.cff.lines[stagedLine.id].payments.forEach(function(payment) {
      if (stagedPaymentsIDs.indexOf(payment.id) === -1) {
        stagedLine.payments.push(payment);
      }
    });
  });

  console.log(stagedLines);

  // const result = yield saveOnFattureInCloud(stagedLines, credentialsFattureInCloud);
  // if (result.error) {
  //   this.throw(500, 'upload to fatture in cloud failed');
  // }
  // result.forEach(function(res) {
  //   if (res.newId !== res.oldId) {
  //     userMainCFF.cff.lines[res.oldId].id = res.newId;
  //     userMainCFF.cff.lines[res.newId] = userMainCFF.cff.lines[res.oldId];
  //     delete userMainCFF.cff.lines[res.oldId];
  //   }
  // });
  // userMainCFF.cff.stagedLines = {};
  // yield db.cffs.update({userId: user._id, type: 'main'}, {$set: {cff: userMainCFF.cff}});
});

app.get('/matches', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  var userBankCFF = yield db.cffs.findOne({userId: user._id, type: 'bank'});

  if (!userMainCFF || !userBankCFF) {
    this.throw(400, 'database is incomplete, please run scrapers.');
  }

  var matchesDB = yield db.matches.findOne({userId: user._id});
  var stagedMatchesDB = yield db.stagedMatches.findOne({userId: user._id});

  var matches = matchesDB ? utils.getArrayFromObject(matchesDB.matches) : [];
  var stagedMatches = stagedMatchesDB ? utils.getArrayFromObject(stagedMatchesDB.stagedMatches) : [];

  var mainPaymentsIDs = matches.concat(stagedMatches).map(function(match) {return match.main;});
  var dataPaymentsIDs = matches.concat(stagedMatches).map(function(match) {return match.data;});

  var mainPayments = utils.getPaymentsFromCFF(userMainCFF.cff);
  var dataPayments = utils.getPaymentsFromCFF(userBankCFF.cff);

  var filteredMainPayments = mainPayments.filter(function(mainPayment) {
    return mainPaymentsIDs.indexOf(mainPayment.id) === -1;
  });

  var filteredDataPayments = dataPayments.filter(function(dataPayment) {
    return dataPaymentsIDs.indexOf(dataPayment.id) === -1;
  });

  // create body
  const todo = getMatches({
    data: filteredDataPayments,
    main: filteredMainPayments
  });

  const stage = stagedMatches.map(function(match) {
    const main = mainPayments.filter(function(p) {return p.id === match.main})[0];
    const data = dataPayments.filter(function(p) {return p.id === match.data})[0];
    return {
      id: main.id + data.id,
      main: main,
      data: data
    };
  });

  const done = matches.map(function(match) {
    const main = mainPayments.filter(function(p) {return p.id === match.main})[0];
    const data = dataPayments.filter(function(p) {return p.id === match.data})[0];
    return {
      id: main.id + data.id,
      main: main,
      data: data
    };
  });

  this.objectName = 'matches';
  this.body = {
    todo: todo,
    stage: stage,
    done: done
  };
});

app.post('/matches/stage/clear', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  yield db.stagedMatches.update({userId: user._id}, {userId: user._id, stagedMatches: {}}, {upsert: true});
});

app.delete('/matches/stage/:matchId', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var matchId = this.params.matchId;
  var unsetModifier = {$unset: {}};
  unsetModifier.$unset['stagedMatches.' + matchId] = '';
  yield db.stagedMatches.update({userId: user._id}, unsetModifier);
});

app.post('/matches/stage/commit', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var stagedMatchesDB = yield db.stagedMatches.findOne({userId: user._id});
  var stagedMatches = utils.getArrayFromObjects(stagedMatchesDB.stagedMatches);
  if (stagedMatches.length > 0) {
    this.throw(400, 'stage area is empty');
  }
  yield db.stagedMatches.update({userId: user._id}, {userId: user._id, stagedMatches: {}}, {upsert: true});
});

app.put('/matches/stage/mainPaymentId/:mainPaymentId/dataPaymentId/:dataPaymentId', function *() {
  var token = utils.parseAuthorization(this.request.header.authorization);
  var user = yield utils.getUserByToken(db, token);
  var mainPaymentId = this.params.mainPaymentId;
  var dataPaymentId = this.params.dataPaymentId;

  var userMainCFF = yield db.cffs.findOne({userId: user._id, type: 'main'});
  var bankMainCFF = yield db.cffs.findOne({userId: user._id, type: 'bank'});

  if (!userMainCFF) {
    this.throw(400, 'user does not have a main CFF');
  }
  if (!bankMainCFF) {
    this.throw(400, 'user does not have a data CFF');
  }

  var mainPayment = utils.getPaymentsFromCFF(userMainCFF.cff).filter(function(p) {
    return p.id === mainPaymentId;
  });
  var dataPayment = utils.getPaymentsFromCFF(bankMainCFF.cff).filter(function(p) {
    return p.id === dataPaymentId;
  });

  if (!mainPayment) {
    this.throw(400, 'the given mainPaymentId does not correspond to any payment');
  }
  if (!dataPayment) {
    this.throw(400, 'the given dataPaymentId does not correspond to any payment');
  }

  var stagedMatchesDB = (yield db.stagedMatches.findOne({userId: user._id}));
  var stagedMatches = stagedMatchesDB ? stagedMatchesDB.stagedMatches : {};
  var matchId = mainPaymentId + dataPaymentId;

  if (stagedMatches[matchId]) {
    this.throw(400, 'you already have a match with these IDs');
  }

  // update stagedMatches
  var setModifier = {$set:{}};
  setModifier.$set['stagedMatches.' + matchId] = {main: mainPaymentId, data: dataPaymentId};
  yield db.stagedMatches.update({userId: user._id}, setModifier, {upsert: true});
});

app.get('/projects', function *() {
  //
});

app.get('/resources', function *() {
  //
});

app.listen(9000);

