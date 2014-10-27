'use strict';

const Immutable = require('immutable');

const calculateExpectedCashflow = (cff) => {
  // group payments in one single vector and insert field 'info' with every important information in each payment.
  const groupedPayments = cff.get('lines').flatMap((line) => line.get('payments')
    .map((p) => {
      let info = Immutable.Map();
      info = info.set('flowDirection', line.get('flowDirection'));
      info = info.set('lineId', line.get('id'));
      info = line.has('invoice') ? info.set('invoice', line.get('invoice')) : info;
      info = line.has('company') ? info.set('company', line.get('company')) : info;
      info = line.has('description') ? info.set('description', line.get('description')) : info;
      info = p.has('method') ? info.set('method', p.get('method')) : info;
      info = p.has('methodType') ? info.set('methodType', p.get('methodType')) : info;
      return p.set('info', info);
    })
  );

  // create object with firstDate, splitDate, lastDate
  const splitDate = groupedPayments.reduce((acc, payment) => {
      const closestDate = payment.get('date') || payment.getIn(['expectedDate', 1]);
      // check if payment is uncertain. if it is update splitDate
      const paymentUncertain = !(payment.has('date') && payment.has('grossAmount'));
      return paymentUncertain && (typeof acc === 'undefined' || closestDate < acc) ? closestDate : acc;
    },
    undefined
  );

  // create object with history, best and worst lines.
  const cashflows = groupedPayments.reduce((cashflowsAcc, payment) => {
      // intervals are formatted as [worst, best] with conventional flowDirection 'in'.
      const closestDate = payment.get('date') || payment.getIn(['expectedDate', 1]);
      let dates = Immutable.Vector(payment.get('date') || payment.getIn(['expectedDate', 0]), payment.get('date') || payment.getIn(['expectedDate', 1]));
      let grosses = Immutable.Vector(payment.get('grossAmount') || payment.getIn(['expectedGrossAmount', 0]),
        payment.get('grossAmount') || payment.getIn(['expectedGrossAmount', 1]));

      // if flowDirection 'out' invert previous worsts / bests and set gross sign to negative
      if (payment.getIn(['info', 'flowDirection']) === 'out') {
        dates = dates.reverse().toVector();
        grosses = grosses.reverse().map((g) => -g).toVector();
      }

      if (closestDate < splitDate) {
        // we're in the history line -> best and worst values coincide.
        const point = Immutable.Map({
          date: dates.get(0),
          grossAmount: grosses.get(0),
          info: payment.get('info')
        });
        cashflowsAcc = cashflowsAcc.set('history', cashflowsAcc.get('history').push(point));
      } else {
        // we're after the history line -> best != worst -> we must separate values in two lines
        const worstPoint = Immutable.Map({
          date: dates.get(0),
          grossAmount: grosses.get(0),
          info: payment.get('info')
        });

        const bestPoint = Immutable.Map({
          date: dates.get(1),
          grossAmount: grosses.get(1),
          info: payment.get('info')
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
  const today = new Date();
  const todayFormatted = [today.getFullYear(), ('0' + today.getMonth() + 1).slice(-2), ('0' + today.getDate()).slice(-2)].join('-');

  const warnings = cff.get('lines').reduce((warningsAcc, line) => {
      const warning = {
        lineId: line.get('id') || 'UNKNOWN_LINE_ID',
        msg: 'one or more payments are out of date'
      };
      const hasWarnings = line.get('payments').every((payment) => payment.getIn(['expectedDate', 1]) > splitDate &&
        payment.getIn(['expectedDate', 1]) < todayFormatted);

      return hasWarnings ? warningsAcc.push(warning) : warningsAcc;
    },
    Immutable.Vector()
  );

  const report = Immutable.Map({output: cashflows});

  return warnings.length > 0 ? report.set('warnings', warnings) : report;
};

module.exports = calculateExpectedCashflow;
