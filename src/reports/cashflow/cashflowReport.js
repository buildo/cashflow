'use strict';

const Immutable = require('immutable');

const generateCashflows = require('./cashflowsGenerator.js');
const mergeCashflowPoints = require('./mergeCashflowPoints.js');
const cumulateCashflows = require('./cumulativeCashflows.js');

const generateCashFlowReport = (cff, startValue) => {

  const reportFunctions = [
    generateCashflows,
    (cashflows) => mergeCashflowPoints(cashflows, startValue),
    cumulateCashflows
  ];

  const initWarnings = [{
    sourceId: cff.get('sourceId'),
    msg: 'no start value'
  }];

  const emptyReport = typeof startValue === 'undefined' ? Immutable.fromJS({cashflow: cff, warnings: initWarnings})
    : Immutable.Map({cashflow: cff});

  const report = reportFunctions.reduce((acc, reportFunction) => {
      if (acc.has('errors')) {
        return acc;
      }
      const returnedMap = reportFunction(acc.get('cashflow'));
      if (returnedMap.has('errors')) {
        return Immutable.Map({errors: returnedMap.get('errors')});
      }
      if (returnedMap.has('warnings')) {
        const oldWarnings = acc.get('warnings') || Immutable.Vector();
        acc = acc.set('warnings', oldWarnings.concat(returnedMap.get('warnings')));
      }

      return acc.set('cashflow', returnedMap.get('cashflow'));
    },
    emptyReport
  );

  return report;
};

module.exports = generateCashFlowReport;