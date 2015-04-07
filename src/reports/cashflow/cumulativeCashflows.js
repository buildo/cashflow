'use strict';

const Immutable = require('immutable');

const cumulateCashflows = (cashflows, startPoint) => {
  startPoint = Immutable.fromJS(startPoint);
  const firstBestDate = cashflows.getIn(['best', 0, 'date']);
  const firstWorstDate = cashflows.getIn(['worst', 0, 'date']);
  const firstUncertainDate = firstWorstDate < firstBestDate ? firstWorstDate : firstBestDate;
  const lastCertainDate = cashflows.get('history').last() ? cashflows.get('history').last().get('date') : undefined;

  const historyFlow = cashflows.get('history').size === 0  && startPoint ? cashflows.get('history').push(startPoint) : cashflows.get('history');

  if (startPoint && (startPoint.get('date') > firstUncertainDate || startPoint.get('date') > lastCertainDate)) {
    return Immutable.fromJS({
      errors: [
        {
          msg: 'startPoint date can\'t be in the uncertain area'
        }
      ]
    });
  }


  const getCumulativeFlow = (flow, _deltaValue) => {
    if (flow.size === 0) {
      return Immutable.List();
    }
    _deltaValue = typeof _deltaValue === 'undefined' ? 0 : _deltaValue;
    const firstPoint = flow.get(0).set('grossAmount', flow.getIn([0, 'grossAmount']) + _deltaValue);
    return flow.shift().reduce((acc, point, index) => {
      const newPoint = point.set('grossAmount', point.get('grossAmount') + acc.getIn([index, 'grossAmount']));
      return acc.push(newPoint);
      },
      Immutable.List([firstPoint])
    );
  };

  const getDeltaValue = (historyFlow, startPoint) => {
    const rightPoint = historyFlow.find((point) => point.get('date') >= startPoint.get('date'));
    const leftPoint = historyFlow.reverse().find((point) => point.get('date') <= startPoint.get('date'));
    if (!leftPoint) {
      return startPoint.get('grossAmount');
    }
    // return startPoint.get('grossAmount') - ((rightPoint.get('grossAmount') + leftPoint.get('grossAmount')) / 2);
    return startPoint.get('grossAmount') - leftPoint.get('grossAmount');
  };
  const deltaValue = startPoint ? getDeltaValue(getCumulativeFlow(historyFlow), startPoint) : 0;
  const cumulativeHistory = getCumulativeFlow(historyFlow, deltaValue);
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