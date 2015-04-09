'use strict';

var Immutable = require('immutable');

var generateCashflows = require('./cashflowsGenerator.js');
var filterCashflows = require('./cashflowFilters.js');
var mergeCashflowPoints = require('./mergeCashflowPoints.js');
var cumulateCashflows = require('./cumulativeCashflows.js');

var generateCashFlowReport = function(cff, configs)  {

  var reportFunctions = [
    generateCashflows,
    function(cashflows)  {return filterCashflows(cashflows, configs.filterParameters)},
    mergeCashflowPoints,
    function(cashflows)  {return cumulateCashflows(cashflows, configs.startPoint)}
  ];

  var initWarnings = [{
    sourceId: cff.get('sourceId'),
    msg: 'no start point'
  }];

  var emptyReport = typeof configs.startPoint === 'undefined' ? Immutable.fromJS({cashflow: cff, warnings: initWarnings})
    : Immutable.Map({cashflow: cff});

  var report = reportFunctions.reduce(function(acc, reportFunction)  {
      if (acc.has('errors')) {
        return acc;
      }
      var returnedMap = reportFunction(acc.get('cashflow'));
      if (returnedMap.has('errors')) {
        return Immutable.Map({errors: returnedMap.get('errors')});
      }
      if (returnedMap.has('warnings')) {
        var oldWarnings = acc.get('warnings') || Immutable.List();
        acc = acc.set('warnings', oldWarnings.concat(returnedMap.get('warnings')));
      }

      return acc.set('cashflow', returnedMap.get('cashflow'));
    },
    emptyReport
  );

  return report;
};

module.exports = generateCashFlowReport;