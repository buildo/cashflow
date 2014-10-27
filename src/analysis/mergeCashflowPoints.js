'use strict';

const Immutable = require('immutable');

const collapseCashflows = (cashflows, startValue) => {

  const sortByDate = (a, b) => {
    const dateA = parseInt(a.get('date').replace('-', ''), 10);
    const dateB = parseInt(b.get('date').replace('-', ''), 10);
    return dateA - dateB;
  };

  const mergeCashflowPoints = (cashflow) => {
    const mergedMap = cashflow.reduce((acc, point) => {
        const date = point.get('date');
        const grossAmount = point.get('grossAmount');
        const info = point.get('info');
        if (acc.has(date)) {
          acc = acc.setIn([date, 'grossAmount'], acc.getIn([date, 'grossAmount']) + grossAmount);
          acc = acc.setIn([date, 'info'], acc.getIn([date, 'info']).push(info));
        } else {
          acc = acc.set(date, point);
          acc = acc.setIn([date, 'info'], Immutable.Vector(info));
        }
        return acc;
      },
      Immutable.Map()
    );
    return mergedMap.toVector().sort(sortByDate);
  };

  // insert startPoint in history with firstDate as date
  const firstHistoryPoint = cashflows.get('history').min((a, b) => a.get('date') > b.get('date'));
  const startPoint = Immutable.Map({
    date: firstHistoryPoint.get('date'),
    grossAmount: startValue,
    info:{
      description: 'START_VALUE'
    }
  });

  cashflows = cashflows.set('history', cashflows.get('history').push(startPoint));

  return Immutable.Map({
    output: cashflows.map((cashflow) => mergeCashflowPoints(cashflow))
  });
};

module.exports = collapseCashflows;
