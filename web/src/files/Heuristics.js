'use strict';

const Immutable = require('immutable');

const creditCardsMethods = ['buildocard', 'Carta di credito'];

module.exports = [
  {
    // credit cards end of month
    match: (line) => true,
    edit: (line) => {
      const monthDays = 30;
      const monthMillis = 86400000 * monthDays;
      return line.set('payments', line.get('payments').map((payment) => {
        const matchingMethods = creditCardsMethods.filter((method) => payment.has('method') && payment.get('method').indexOf(method) > -1);
        if (payment.get('methodType') === 'credit card' || matchingMethods.length > 0) {
          const date = new Date(payment.get('date'));
          const payDate = new Date('2014-09-30');
          const millisDiff = date.getTime() - payDate.getTime();
          const integerMonthsDiff = Math.floor(millisDiff / monthMillis);
          const monthsDiff = millisDiff > 0 ? integerMonthsDiff + 1 : integerMonthsDiff - 1;
          // modify payDate
          payDate.setDate(payDate.getDate() + (monthDays * monthsDiff) + monthDays); // accumulo al giorno corretto, pagamento il mese dopo.
          const newDate = [payDate.getFullYear(), ('0' + (payDate.getMonth() + 1)).slice(-2), ('0' + payDate.getDate()).slice(-2)].join('-');
          // console.log(monthsDiff, newDate);
          return payment.set('date', newDate);
        }
        return payment;
      }));
    }
  }, 
  {
    // change expected date with parsed instructions
    match: (line) => {
      return line.has('payments') && line.get('payments').some((payment) => payment.has('heuristicInstructions') && payment.get('heuristicInstructions').count() > 0);
    },
    edit: (line) => {
      const putBigFirst = (interval) => {
        return Immutable.List.isList(interval) && interval.get(1) > interval.get(0) ?
          interval.reverse() : interval;
      };
      const newPayments = line.get('payments').reduce((acc, payment) => {
          const instructions = payment.get('heuristicInstructions');
          const _expectedDate = instructions.get('expectedDate');
          const expectedDate = Immutable.List.isList(_expectedDate) ? _expectedDate : Immutable.List([_expectedDate, _expectedDate]);
          if (expectedDate) {
            payment = payment.set('expectedDate', putBigFirst(expectedDate));
          }
          return acc.push(payment);
        },
        Immutable.List()
      );
      return line.set('payments', newPayments);
    }
  }
];