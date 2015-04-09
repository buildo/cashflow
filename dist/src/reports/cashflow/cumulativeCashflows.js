'use strict';

var Immutable = require('immutable');

var cumulateCashflows = function(cashflows, startPoint)  {
  startPoint = Immutable.fromJS(startPoint);
  var firstBestDate = cashflows.getIn(['best', 0, 'date']);
  var firstWorstDate = cashflows.getIn(['worst', 0, 'date']);
  var firstUncertainDate = firstWorstDate < firstBestDate ? firstWorstDate : firstBestDate;
  var lastCertainDate = cashflows.get('history').last() ? cashflows.get('history').last().get('date') : undefined;

  var historyFlow = cashflows.get('history').size === 0  && startPoint ? cashflows.get('history').push(startPoint) : cashflows.get('history');

  if (startPoint && (startPoint.get('date') > firstUncertainDate || startPoint.get('date') > lastCertainDate)) {
    return Immutable.fromJS({
      errors: [
        {
          msg: 'startPoint date can\'t be in the uncertain area'
        }
      ]
    });
  }


  var getCumulativeFlow = function(flow, _deltaValue)  {
    if (flow.size === 0) {
      return Immutable.List();
    }
    _deltaValue = typeof _deltaValue === 'undefined' ? 0 : _deltaValue;
    var firstPoint = flow.get(0).set('grossAmount', flow.getIn([0, 'grossAmount']) + _deltaValue);
    return flow.shift().reduce(function(acc, point, index)  {
      var newPoint = point.set('grossAmount', point.get('grossAmount') + acc.getIn([index, 'grossAmount']));
      return acc.push(newPoint);
      },
      Immutable.List([firstPoint])
    );
  };

  var getDeltaValue = function(historyFlow, startPoint)  {
    var rightPoint = historyFlow.find(function(point)  {return point.get('date') >= startPoint.get('date')});
    var leftPoint = historyFlow.reverse().find(function(point)  {return point.get('date') <= startPoint.get('date')});
    if (!leftPoint) {
      return startPoint.get('grossAmount');
    }
    // return startPoint.get('grossAmount') - ((rightPoint.get('grossAmount') + leftPoint.get('grossAmount')) / 2);
    return startPoint.get('grossAmount') - leftPoint.get('grossAmount');
  };
  var deltaValue = startPoint ? getDeltaValue(getCumulativeFlow(historyFlow), startPoint) : 0;
  var cumulativeHistory = getCumulativeFlow(historyFlow, deltaValue);
  var lastHistoryValue = cumulativeHistory.last().get('grossAmount');

  return Immutable.fromJS({
    cashflow:{
      history: cumulativeHistory,
      worst: getCumulativeFlow(cashflows.get('worst'), lastHistoryValue),
      best: getCumulativeFlow(cashflows.get('best'), lastHistoryValue)
    }
  });
};

module.exports = cumulateCashflows;