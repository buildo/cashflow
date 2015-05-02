'use strict';

var Immutable = require('immutable');

var collapseCashflows = function(cashflows)  {
  // startValue = typeof startValue === 'undefined' ? 0 : startValue;

  var sortByDate = function(a, b)  {
    var dateA = parseInt(a.get('date').split('-').join(''), 10);
    var dateB = parseInt(b.get('date').split('-').join(''), 10);
    return dateA - dateB;
  };

  var mergeCashflowPoints = function(cashflow)  {
    var mergedMap = cashflow.reduce(function(acc, point)  {
        var date = point.get('date');
        var grossAmount = point.get('grossAmount');
        var info = point.get('info');
        if (acc.has(date)) {
          acc = acc.setIn([date, 'grossAmount'], acc.getIn([date, 'grossAmount']) + grossAmount);
          acc = acc.setIn([date, 'info'], acc.getIn([date, 'info']).push(info));
        } else {
          acc = acc.set(date, point);
          acc = acc.setIn([date, 'info'], Immutable.List([info]));
        }
        return acc;
      },
      Immutable.Map()
    );

    return mergedMap.toIndexedSeq().toList().sort(sortByDate);
  };

  // // create startPoint with startValue and most ancient date. Insert it in history
  // const getFlowFirstPoint = (cashflow) =>
  //   cashflow.reduce((firstPointAcc, point) => firstPointAcc = point.get('date') < firstPointAcc.get('date') ? point : firstPointAcc);

  // const firstDate = cashflows.reduce((acc, flow) => flow.size > 0 && getFlowFirstPoint(flow).get('date') < acc ?
  //   getFlowFirstPoint(flow).get('date') : acc, 'z'
  // );

  // const startPoint = Immutable.fromJS({
  //   date: firstDate,
  //   grossAmount: startValue,
  //   info:{
  //     date: firstDate,
  //     grossAmount: startValue,
  //     description: 'START_VALUE'
  //   }
  // });

  // cashflows = cashflows.set('history', cashflows.get('history').push(startPoint));

  // return cashflows with merged points
  return Immutable.Map({
    cashflow: cashflows.map(function(cashflow)  {return mergeCashflowPoints(cashflow)})
  });
};

module.exports = collapseCashflows;
