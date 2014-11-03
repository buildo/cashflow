'use strict';

const Immutable = require('immutable');
const generateCashflowReport = require('../reports/cashflow/cashflowReport.js');
const generateCreditCardsReport = require('../reports/credit_cards/creditCardsReport.js');


const generateReports = (cff, configs) => {
  const reportGenerators = [
    generateCashflowReport,
    generateCreditCardsReport
  ];

  const reports = reportGenerators.reduce((acc, reportGenerator) => {
      let report = reportGenerator(cff, configs);
      // merge errors
      if (report.has('errors')) {
        const oldErrors = acc.get('errors') || Immutable.Vector();
        acc = acc.set('errors', oldErrors.concat(report.get('errors')));
      }

      // merge warnings
      if (report.has('warnings')) {
        const oldWarnings = acc.get('warnings') || Immutable.Vector();
        report = report.set('warnings', oldWarnings.concat(report.get('warnings')));
      }

      // replace errors and warnings with merged one and add report output (each report returns output with a unique key)
      report.keySeq().forEach((key) => acc = acc.set(key, report.get(key)));
      return acc;
    },
    Immutable.Map()
  );

  return reports;
};

module.exports = generateReports;
