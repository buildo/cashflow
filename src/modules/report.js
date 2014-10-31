'use strict';

const Immutable = require('immutable');
const generateCashflowReport = require('../reports/cashflow/cashflowReport.js');
const generateCreditCardsReport = require('../reports/credit_cards/creditCardsReport.js');


const generateReports = (cff, startValue) => {
  const reportGenerators = [
    (cff) => generateCashflowReport(cff, startValue),
    generateCreditCardsReport
  ];

  const reports = reportGenerators.reduce((acc, reportGenerator) => {
      const report = reportGenerator(cff);
      // merge errors
      if (report.has('errors') && acc.has('errors')) {
        acc = acc.set('errors', acc.get('errors').concat(report.get('errors')));
      }
      // merge warnings
      if (report.has('warnings') && acc.has('warnings')) {
        acc = acc.set('warnings', acc.get('warnings').concat(report.get('warnings')));
      }
      // add report output (each report returns output with a unique key)
      return report.mergeDeep(acc);
    },
    Immutable.Map()
  );

  return reports;
};

module.exports = generateReports;
