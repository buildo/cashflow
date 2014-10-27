'use strict';

const Immutable = require('immutable');

const generateCashflows = require('../analysis/cashflowsGenerator.js');
const mergeCashflowPoints = require('../analysis/mergeCashflowPoints.js');
const cumulateCashflows = require('../analysis/cumulativeCashflows.js');


const generateReport = (cff, startValue) => {

  const reportFunctions = [
    generateCashflows,
    (cashflows) => mergeCashflowPoints(cashflows, startValue),
    cumulateCashflows
  ];

  const pushWarnings = (flowObject, warnings) => {
    const oldWarnings = flowObject.get('warnings') || Immutable.Vector();
    return flowObject.set('warnings', oldWarnings.concat(warnings));
  };

  const report = reportFunctions.reduce((acc, reportFunction) => {
      if (acc.has('errors')) {
        return acc;
      }
      const returnedMap = reportFunction(acc.get('output'));
      if (returnedMap.has('errors')) {
        return Immutable.Map({errors: returnedMap.get('errors')});
      }
      if (returnedMap.has('warnings')) {
        acc = pushWarnings(acc, returnedMap.get('warnings'));
      }
      if (returnedMap.has('output')) {
        acc = acc.set('output', returnedMap.get('output'));
      }
      return acc;
    },
    Immutable.Map().set('output', cff)
  );

  return report;
};

module.exports = generateReport;