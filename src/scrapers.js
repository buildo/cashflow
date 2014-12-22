'use strict';

var _Promise = require('bluebird');
var co = require('co');
var scrapeBperCreditCard = require('bper-credit-card');
var scrapeFattureInCloud = require('fatture-in-cloud');
var bper = require('bper').scrapeBPER;

// var oldCFF = {};

// var credentials = {
//   bper: {
//     user: '55084063',
//     password: 'Bej@hY(2'
  // Bej%40hY%282
//   },
//   bperCreditCard: [
//     {
//       name: 'luca',
//       user: '10353210',
//       password: 'YnCqoNe8R4gXpQ'
//     },
//     {
//       name: 'giovanni',
//       user: '10332099',
//       password: 'P6XMUnrXxk5OS*0M8txm'
//     },
//     {
//       name: 'daniele',
//       user: '17203425',
//       password: 'meg7jeM6hAv4'
//     },
//     {
//       name: 'gabro',
//       user: '10780040',
//       password: 'w6Gb*A3NHPsPAZAs'
//     },
//     {
//       name: 'claudio',
//       user: '10165970',
//       password: '1wdcvfe23rgb!'
//     }
//   ],
//   fattureInCloud: {
//     'email': 'dontspamus@buildo.io',
//     'password': 'nZU88HJPwLuhCw'
//   }
// };

var setProgressFattureInCloud = function(db, userId, progressObject) {
  co(function *() {
    var _progress = {
      authentication: progressObject.login.authentication,
      invoices: {
        list: progressObject.invoiceScraper.mainRequest,
        data: progressObject.invoiceScraper.modifyData
      },
      expenses: {
        list: progressObject.expenseScraper.mainRequest,
        data: progressObject.expenseScraper.modifyData,
      }
    };
    yield db.progresses.update({userId: userId, type: 'fattureincloud'}, {$set: {progress: _progress}}, {upsert: true});
  });
};


var banks = [
  {
    id: 'bper',
    scraper: bper
  },
  {
    id: 'bper-credit-card',
    scraper: scrapeBperCreditCard
  }
];

var getBperCreditCard = function (credentialsBperCreditCard) {
  return scrapeBperCreditCard(credentialsBperCreditCard)
    .then(function(bperCreditCardReport) {
      return _Promise.resolve({bperCreditCard: bperCreditCardReport});
    });
};

var getFattureInCloud = function (db, userId, credentialsFattureInCloud, oldCFF) {
  var progressCallback = function (progressObject) {
    setProgressFattureInCloud(db, userId, progressObject);
  };
  return scrapeFattureInCloud(credentialsFattureInCloud, progressCallback, oldCFF)
    .then(function(fattureInCloudReport) {
      return _Promise.resolve({fattureInCloud: fattureInCloudReport});
    });
};

var getBank = function (bankCredentials, inputParameters) {
  var scraper = banks.filter(function(bankObj) {return bankObj.id === bankCredentials.bankId;})[0].scraper;
  return scraper(bankCredentials, inputParameters)
    .then(function(bankReport) {return _Promise.resolve({bank: bankReport});});
};

// var getAll = function (credentials, oldCFF) {
//   var getReports = function (credentials) {
//     return _Promise.all([scrapeBper(credentials.bper), scrapeBperCreditCard(credentials.bperCreditCard), scrapeFattureInCloud(credentials.fattureInCloud, oldCFF)]);
//   };

//   var getCFFs = function (reports) {
//     var mergedCFF = reports.map(function (report) {
//       return report.cff;
//     });

//     return _Promise.resolve({
//       mergedCFF: mergedCFF,
//       bank: reports[0],
//       bperCreditCard: reports[1],
//       fattureInCloud: reports[2]
//     });
//   };

//   return getReports(credentials)
//     .then(getCFFs);
// };



module.exports = {
  // getAll: getAll,
  getBank: getBank,
  getFattureInCloud: getFattureInCloud,
  getBperCreditCard: getBperCreditCard
};
