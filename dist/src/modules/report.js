'use strict';

var Immutable = require('immutable');
var generateCashflowReport = require('../reports/cashflow/cashflowReport.js');
var generateCreditCardsReport = require('../reports/credit_cards/creditCardsReport.js');


var generateReports = function(cff, configs)  {
  var reportGenerators = [
    generateCashflowReport,
    generateCreditCardsReport
  ];

  var reports = reportGenerators.reduce(function(acc, reportGenerator)  {
      var report = reportGenerator(cff, configs);
      // merge errors
      if (report.has('errors')) {
        var oldErrors = acc.get('errors') || Immutable.List();
        acc = acc.set('errors', oldErrors.concat(report.get('errors')));
      }

      // merge warnings
      if (report.has('warnings')) {
        var oldWarnings = acc.get('warnings') || Immutable.List();
        report = report.set('warnings', oldWarnings.concat(report.get('warnings')));
      }

      // replace errors and warnings with merged one and add report output (each report returns output with a unique key)
      report.keySeq().forEach(function(key)  {return acc = acc.set(key, report.get(key))});
      return acc;
    },
    Immutable.Map()
  );

  return reports;
};

module.exports = generateReports;
