'use strict';

const Immutable = require('immutable');

const collapseCashflows = (cashflows) => {
  // startValue = typeof startValue === 'undefined' ? 0 : startValue;

  const sortByDate = (a, b) => {
    const dateA = parseInt(a.get('date').split('-').join(''), 10);
    const dateB = parseInt(b.get('date').split('-').join(''), 10);
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
    cashflow: cashflows.map((cashflow) => mergeCashflowPoints(cashflow))
  });
};

module.exports = collapseCashflows;
