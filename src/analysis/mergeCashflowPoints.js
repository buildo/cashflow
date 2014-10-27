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

  // create startPoint with startvalue and most ancient date. Insert it in history
  const getFlowFirstPoint = (cashflow) =>
    cashflow.reduce((firstPointAcc, point) => firstPointAcc = point.get('date') < firstPointAcc.get('date') ? point : firstPointAcc);

  const firstDate = cashflows.reduce((acc, flow) => flow.length > 0 && getFlowFirstPoint(flow).get('date') < acc ?
    getFlowFirstPoint(flow).get('date') : acc, 'z'
  );

  const startPoint = Immutable.Map({
    date: firstDate,
    grossAmount: startValue,
    info:{
      description: 'START_VALUE'
    }
  });

  cashflows = cashflows.set('history', cashflows.get('history').push(startPoint));

  // return cashflows with merged points
  return Immutable.Map({
    output: cashflows.map((cashflow) => mergeCashflowPoints(cashflow))
  });
};

module.exports = collapseCashflows;
