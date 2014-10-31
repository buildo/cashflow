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

  const pushWarnings = (flowObject, warnings) => {
    const oldWarnings = flowObject.get('warnings') || Immutable.Vector();
    return flowObject.set('warnings', oldWarnings.concat(warnings));
  };

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
        acc = pushWarnings(acc, returnedMap.get('warnings'));
      }
      if (returnedMap.has('cashflow')) {
        acc = acc.set('cashflow', returnedMap.get('cashflow'));
      }
      return acc;
    },
    emptyReport
  );

  pushWarnings(report, [{sourceId: cff.get('sourceId'), msg: 'no start value'}]);

  return report;
};

module.exports = generateCashFlowReport;