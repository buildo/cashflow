'use strict';

var _Promise = require('bluebird');
var co = require('co');
var cashflowScrapers = require('cashflow-scrapers');
var scrapeBperCreditCard = cashflowScrapers.bperCreditCard;
var scrapeFattureInCloud = cashflowScrapers.fattureInCloud;
var bper = cashflowScrapers.bper.scrapeBPER;

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
  return scrapeFattureInCloud(credentialsFattureInCloud.credentials, progressCallback, oldCFF, {minDate: '2015-01-01'})
    .then(function(fattureInCloudReport) {
      return _Promise.resolve({fattureInCloud: fattureInCloudReport});
    });
};

var getBank = function (bankCredentials, inputParameters, oldLines) {
  var scraper = banks.filter(function(bankObj) {return bankObj.id === bankCredentials.bankId;})[0].scraper;
  return scraper(bankCredentials.credentials, inputParameters, oldLines)
    .then(function(bankReport) {
      bankReport.cffs = bankReport.cffs || [bankReport.cff];
      return _Promise.resolve({bank: bankReport});
    });
};

module.exports = {
  getBank: getBank,
  getFattureInCloud: getFattureInCloud,
  getBperCreditCard: getBperCreditCard
};
