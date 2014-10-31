'use strict';

const Immutable = require('immutable');

const generateCreditCardsReport = (cff) => {
  const groupedPayments = cff.get('lines').flatMap((line) => line.get('payments'));
  const totalAmount = groupedPayments.reduce((acc, payment) => payment.methodType === 'credit card' ? acc + payment.grossAmount : acc);
  return Immutable.Map({creditCards: totalAmount});
};

module.exports = generateCreditCardsReport;