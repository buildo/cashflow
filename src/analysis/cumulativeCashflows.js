'use strict';

const Immutable = require('immutable');

const cumulateCashflows = (cashflows, startValue) => {

  const keys = Immutable.Vector('history', 'worst', 'best');
  const indipendentCumulativeFlows = keys.map((key) => cashflows.get(key).map((point, index) => {
    if (index !== 0) {
      return point.set('grossAmount', point.get('grossAmount') + cashflows.getIn([key, index - 1, 'grossAmount']));
    }
    return point;
  }));

  console.log(indipendentCumulativeFlows.get(0).last());

  const lastHistoryValue = indipendentCumulativeFlows.last().get('grossAmount');

  const dipendentBestWorst = indipendentCumulativeFlows.toVector().shift().map((flow) => flow.map((point) => {
    return point.set('grossAmount', point.get('grossAmount') + lastHistoryValue);
  }));

  return Immutable.fromJS({
    output:{
      history: indipendentCumulativeFlows.get(0),
      worst: dipendentBestWorst.get(0),
      best: dipendentBestWorst.get(1)
    }
  });

};

module.exports = cumulateCashflows;