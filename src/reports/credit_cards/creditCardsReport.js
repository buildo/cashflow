'use strict';

const Immutable = require('immutable');

const generateCreditCardsReport = (cff) => {

  const getVerbalMonth = (monthIndex) => {
    const months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
    return months[monthIndex - 1];
  };

  const groupedPayments = cff.get('lines').flatMap((line) => line.get('payments'));
  const filteredPayments = groupedPayments.filter((payment) => payment.has('date') && payment.has('grossAmount') &&
    payment.has('method') && payment.get('methodType') === 'credit card');

  const updater = (immutableObj, payment) => {
    immutableObj = immutableObj.set('cumulativeAmount', immutableObj.get('cumulativeAmount') + payment.get('grossAmount'));
    const paymentInfo = Immutable.Map({
      amount: payment.get('grossAmount'),
      date: payment.get('date')
    });
    immutableObj = immutableObj.set('payments', immutableObj.get('payments').push(paymentInfo));
    return immutableObj;
  };

  const reportWithKeys = filteredPayments.reduce((acc, payment) => {
      const verbalMonth = getVerbalMonth(parseInt(payment.get('date').split('-')[1]));
      const person = payment.get('method').split(' ')[1];
      const emptyObj = Immutable.fromJS({person: person, cumulativeAmount: 0, payments: []});
      return acc.updateIn([verbalMonth, person], emptyObj, (immutableObj) => updater(immutableObj, payment));
    },
    Immutable.Map()
  );

  return Immutable.Map({creditCards: reportWithKeys.map((monthReport) => monthReport.toVector()).toMap()});
};

module.exports = generateCreditCardsReport;