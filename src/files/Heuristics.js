'use strict';

const creditCardsMethods = ['buildocard', 'Carta di credito'];

module.exports = [
  {
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
  }
];