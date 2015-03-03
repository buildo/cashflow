'use strict';

var _Promise = require('bluebird');
var co = require('co');
var scrapeBperCreditCard = require('bper-credit-card');
var scrapeFattureInCloud = require('fatture-in-cloud');
var bper = require('bper').scrapeBPER;

var setProgressFattureInCloud = function(db, userId, progressObject) {
  co(function *() {
    var _progress = {
      completed: progressObject.completed,
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
  return scrapeFattureInCloud(credentialsFattureInCloud.credentials, progressCallback, oldCFF)
    .then(function(fattureInCloudReport) {
      return _Promise.resolve({fattureInCloud: fattureInCloudReport});
    });
};

var getBank = function (bankCredentials, inputParameters) {
  var scraper = banks.filter(function(bankObj) {return bankObj.id === bankCredentials.bankId;})[0].scraper;
  return scraper(bankCredentials.credentials, inputParameters)
    .then(function(bankReport) {return _Promise.resolve({bank: bankReport});});
};

module.exports = {
  getBank: getBank,
  getFattureInCloud: getFattureInCloud,
  getBperCreditCard: getBperCreditCard
};
