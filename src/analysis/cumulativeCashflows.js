'use strict';

const Immutable = require('immutable');

const cumulateCashflows = (cashflows) => {

  const historyFlow = cashflows.get('history');

  const getCumulativeFlow = (flow, startValue) => {
    startValue = typeof startValue === 'undefined' ? 0 : startValue;
    const firstPoint = flow.get(0).set('grossAmount', flow.getIn([0, 'grossAmount']) + startValue);
    return flow.shift().reduce((acc, point, index) => {
      const newPoint = point.set('grossAmount', point.get('grossAmount') + acc.getIn([index, 'grossAmount']));
      return acc.push(newPoint);
      },
      Immutable.Vector(firstPoint)
    );
  };

  const cumulativeHistory = getCumulativeFlow(cashflows.get('history'));
  const lastHistoryValue = cumulativeHistory.last().get('grossAmount');

  return Immutable.fromJS({
    output:{
      history: cumulativeHistory,
      worst: getCumulativeFlow(cashflows.get('worst'), lastHistoryValue),
      best: getCumulativeFlow(cashflows.get('best'), lastHistoryValue)
    }
  });
};

module.exports = cumulateCashflows;