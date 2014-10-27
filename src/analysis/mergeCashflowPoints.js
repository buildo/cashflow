'use strict';

const Immutable = require('immutable');

const collapseCashflows = (cashflows) => {

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
    const array = mergedMap.toVector();
    return array.sort(sortByDate);
  };

  return Immutable.Map({
    output: cashflows.map((cashflow) => mergeCashflowPoints(cashflow))
  });
};

module.exports = collapseCashflows;
