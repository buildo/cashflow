'use strict';

const Immutable = require('immutable');

const generateCashflows = require('./cashflowsGenerator.js');
const filterCashflows = require('./cashflowFilters.js');
const mergeCashflowPoints = require('./mergeCashflowPoints.js');
const cumulateCashflows = require('./cumulativeCashflows.js');

const generateCashFlowReport = (cff, configs) => {

  const reportFunctions = [
    generateCashflows,
    (cashflows) => filterCashflows(cashflows, configs.filterParameters),
    (cashflows) => mergeCashflowPoints(cashflows, configs.startValue),
    cumulateCashflows
  ];

  const initWarnings = [{
    sourceId: cff.get('sourceId'),
    msg: 'no start value'
  }];

  const emptyReport = typeof configs.startValue === 'undefined' ? Immutable.fromJS({cashflow: cff, warnings: initWarnings})
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
        const oldWarnings = acc.get('warnings') || Immutable.List();
        acc = acc.set('warnings', oldWarnings.concat(returnedMap.get('warnings')));
      }

      return acc.set('cashflow', returnedMap.get('cashflow'));
    },
    emptyReport
  );

  return report;
};

module.exports = generateCashFlowReport;