'use strict';

const Immutable = require('immutable');
const getFilteredPayments = require('./creditCardsFilters.js');

const generateCreditCardsReport = (cff, configs) => {

  const getVerbalMonth = (monthNumber) => {
    const months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
    return months[monthNumber - 1];
  };

  const groupedPayments = cff.get('lines').flatMap((line) => line.get('payments'));
  const filteredPayments = getFilteredPayments(groupedPayments, configs.filterParameters);

  const updateMonth = (monthMap, payment) => {
    const person = payment.get('method').split(' ')[1];

    const updatePerson = (personMap) => {
      personMap = personMap.set('totalAmount', personMap.get('totalAmount') + payment.get('grossAmount'));
      const paymentInfo = Immutable.Map({
        amount: payment.get('grossAmount'),
        date: payment.get('date')
      });
      personMap = personMap.set('payments', personMap.get('payments').push(paymentInfo));
      return personMap;
    };

    const emptyPerson = Immutable.fromJS(
      {
        name: payment.get('method').split(' ')[1],
        totalAmount: 0,
        payments: []
      }
    );

    monthMap = monthMap.set('totalAmount', monthMap.get('totalAmount') + payment.get('grossAmount'));
    monthMap = monthMap.updateIn(['people', person], emptyPerson, updatePerson);
    return monthMap;
  };

  const reportWithKeys = filteredPayments.reduce((acc, payment) => {
      const dateArray = payment.get('date').split('-');
      const shouldBeInFollowingMonth = dateArray[2] >= 29;
      const monthNumber = parseInt(dateArray[1]) + (shouldBeInFollowingMonth ? 1 : 0);
      const emptyMonth = Immutable.fromJS(
        {
          year: dateArray[0],
          monthNumber: monthNumber,
          month: getVerbalMonth(monthNumber),
          totalAmount: 0,
          people: {}
        }
      );
      return acc.update(getVerbalMonth(monthNumber), emptyMonth, (monthMap) => updateMonth(monthMap, payment));
    },
    Immutable.Map()
  );

  const report = reportWithKeys.map((monthReport) => monthReport.set('people', monthReport.get('people').toVector())).toVector();

  return Immutable.Map({creditCards: report.sort((a, b) => a.get('monthNumber') > b.get('monthNumber'))});
};

module.exports = generateCreditCardsReport;