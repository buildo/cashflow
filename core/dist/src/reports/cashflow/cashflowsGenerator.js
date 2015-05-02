'use strict';

var Immutable = require('immutable');

var calculateExpectedCashflow = function(cff)  {
  // group payments in one single list and insert field 'info' with every important information in each payment.
  var groupedPayments = cff.get('lines').flatMap(function(line)  {return line.get('payments')
    .map(function(p)  {
      var info = Immutable.Map();
      info = info.set('flowDirection', line.get('flowDirection'));
      info = info.set('lineId', line.get('id') || 'UNKNOWN_LINE_ID');
      info = info.set('mergedFrom', line.get('mergedFrom'));
      info = info.set('currency', line.get('currency'));
      info = line.has('invoice') ? info.set('invoice', line.get('invoice')) : info;
      info = line.has('company') ? info.set('company', line.get('company')) : info;
      info = line.has('project') ? info.set('project', line.get('project')) : info;
      info = line.has('description') ? info.set('description', line.get('description')) : info;
      info = p.has('method') ? info.set('method', p.get('method')) : info;
      info = p.has('methodType') ? info.set('methodType', p.get('methodType')) : info;
      return p.set('info', info);
    })}
  );

  var today = new Date();
  var todayFormatted = [today.getFullYear(), ('0' + (today.getMonth() + 1)).slice(-2), ('0' + today.getDate()).slice(-2)].join('-');

  // create object with firstDate, splitDate, lastDate
  var splitDate = groupedPayments.reduce(function(acc, payment)  {
      var closestDate = payment.get('date') || payment.getIn(['expectedDate', 1]);
      // check if payment is uncertain. if it is update splitDate
      var paymentUncertain = !(payment.has('date') && payment.has('grossAmount'));
      return paymentUncertain && (typeof acc === 'undefined' || closestDate < acc) ? closestDate : acc;
    },
    undefined
  ) || todayFormatted;

  // create object with history, best and worst lines.
  var cashflows = groupedPayments.reduce(function(cashflowsAcc, payment)  {
      // intervals are formatted as [worst, best] with conventional flowDirection 'in'.
      var closestDate = payment.get('date') || payment.getIn(['expectedDate', 1]);
      var dates = Immutable.List.of(payment.get('date') || payment.getIn(['expectedDate', 0]), payment.get('date') || payment.getIn(['expectedDate', 1]));
      var grosses = Immutable.List.of(payment.get('grossAmount') || payment.getIn(['expectedGrossAmount', 0]),
        payment.get('grossAmount') || payment.getIn(['expectedGrossAmount', 1]));

      // const convertToEuros = (amount) => amount / payment.getIn(['info', 'currency', 'conversion']);
      // if flowDirection 'out' invert previous worsts / bests and set gross sign to negative
      if (payment.getIn(['info', 'flowDirection']) === 'out') {
        dates = dates.reverse();
        grosses = grosses.reverse().map(function(g)  {return -g});
      }

      grosses = grosses.map(function(gross)  {
        return gross / payment.getIn(['info', 'currency', 'conversion']);
      });

      if (closestDate < splitDate) {
        // we're in the history line -> best and worst values coincide.
        var point = Immutable.Map({
          name: 'history',
          date: dates.get(0),
          grossAmount: grosses.get(0),
          info: payment.get('info').set('date', dates.get(0)).set('grossAmount', grosses.get(0))
        });
        cashflowsAcc = cashflowsAcc.set('history', cashflowsAcc.get('history').push(point));
      } else {
        // we're after the history line -> best != worst -> we must separate values in two lines
        var worstPoint = Immutable.Map({
          name: 'worst',
          date: dates.get(0),
          grossAmount: grosses.get(0),
          info: payment.get('info').set('date', dates.get(0)).set('grossAmount', grosses.get(0))
        });

        var bestPoint = Immutable.Map({
          name: 'best',
          date: dates.get(1),
          grossAmount: grosses.get(1),
          info: payment.get('info').set('date', dates.get(1)).set('grossAmount', grosses.get(1))
        });
        cashflowsAcc = cashflowsAcc.set('worst', cashflowsAcc.get('worst').push(worstPoint));
        cashflowsAcc = cashflowsAcc.set('best', cashflowsAcc.get('best').push(bestPoint));
      }

      return cashflowsAcc;
    },
    Immutable.fromJS({
      history: [],
      best: [],
      worst: []
    })
  );

  // populate warnings
  var warnings = cff.get('lines').reduce(function(warningsAcc, line)  {
      var warning = {
        lineId: line.get('id') || 'UNKNOWN_LINE_ID',
        msg: 'one or more payments are out of date'
      };
      var isValid = line.get('payments').every(function(payment)  {
        var furthestDate = payment.get('date') || payment.getIn(['expectedDate', 0]);
        var isCertain = payment.has('date') && payment.has('grossAmount');
        return isCertain || furthestDate > todayFormatted;
      });

      return isValid ? warningsAcc : warningsAcc.push(warning);
    },
    Immutable.List()
  );

  var report = Immutable.Map({cashflow: cashflows});
  return warnings.size > 0 ? report.set('warnings', warnings) : report;
};

module.exports = calculateExpectedCashflow;
