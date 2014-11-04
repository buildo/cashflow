'use strict';

const Immutable = require('immutable');

const cumulateCashflows = (cashflows) => {

  const historyFlow = cashflows.get('history');

  const getCumulativeFlow = (flow, startValue) => {
    if (flow.size === 0) {
      return Immutable.List();
    }
    startValue = typeof startValue === 'undefined' ? 0 : startValue;
    const firstPoint = flow.get(0).set('grossAmount', flow.getIn([0, 'grossAmount']) + startValue);
    return flow.shift().reduce((acc, point, index) => {
      const newPoint = point.set('grossAmount', point.get('grossAmount') + acc.getIn([index, 'grossAmount']));
      return acc.push(newPoint);
      },
      Immutable.List([firstPoint])
    );
  };

  const cumulativeHistory = getCumulativeFlow(cashflows.get('history'));
  const lastHistoryValue = cumulativeHistory.last().get('grossAmount');

  return Immutable.fromJS({
    cashflow:{
      history: cumulativeHistory,
      worst: getCumulativeFlow(cashflows.get('worst'), lastHistoryValue),
      best: getCumulativeFlow(cashflows.get('best'), lastHistoryValue)
    }
  });
};

module.exports = cumulateCashflows;