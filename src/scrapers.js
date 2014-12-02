'use strict';

var _Promise = require('bluebird');
var scrapeBperCreditCard = require('bper-credit-card');
var scrapeFattureInCloud = require('fatture-in-cloud');

// var oldCFF = {};

// var credentials = {
//   bper: {
//     user: '55084063',
//     password: 'Bej@hY(2'
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

var banks = [
  {
    id: 'bper',
    scraper: require('bper').cff
  }
];

var getBperCreditCard = function (credentialsBperCreditCard) {
  return scrapeBperCreditCard(credentialsBperCreditCard)
    .then(function(bperCreditCardReport) {
      return _Promise.resolve({bperCreditCard: bperCreditCardReport});
    });
};

var getFattureInCloud = function (credentialsFattureInCloud, oldCFF) {
  return scrapeFattureInCloud(credentialsFattureInCloud, oldCFF)
    .then(function(fattureInCloudReport) {
      return _Promise.resolve({fattureInCloud: fattureInCloudReport});
    });
};

var getBank = function (credentialsBank) {
  var scraper = banks.filter(function(bankObj) {return bankObj.id === credentialsBank.id})[0].scraper;
  return scraper(credentialsBank)
    .then(function(bankReport) {return _Promise.resolve({bank: bankReport});});
};

var getAll = function (credentials, oldCFF) {
  var getReports = function (credentials) {
    return _Promise.all([scrapeBper(credentials.bper), scrapeBperCreditCard(credentials.bperCreditCard), scrapeFattureInCloud(credentials.fattureInCloud, oldCFF)]);
  };

  var getCFFs = function (reports) {
    var mergedCFF = reports.map(function (report) {
      return report.cff;
    });

    return _Promise.resolve({
      mergedCFF: mergedCFF,
      bank: reports[0],
      bperCreditCard: reports[1],
      fattureInCloud: reports[2]
    });
  };

  return getReports(credentials)
    .then(getCFFs);
};

module.exports = {
  getAll: getAll,
  getBank: getBank,
  getFattureInCloud: getFattureInCloud,
  getBperCreditCard: getBperCreditCard
};
