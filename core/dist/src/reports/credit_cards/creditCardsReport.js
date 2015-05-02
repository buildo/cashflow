'use strict';

var Immutable = require('immutable');
var getFilteredPayments = require('./creditCardsFilters.js');

var generateCreditCardsReport = function(cff, configs)  {

  var getVerbalMonth = function(monthNumber)  {
    var months = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
    return months[monthNumber - 1];
  };

  // group payments in one single list and insert field 'info' with every important information in each payment.
  var groupedPayments = cff.get('lines').flatMap(function(line)  {return line.get('payments')
    .map(function(payment)  {return payment.setIn(['info', 'currency'], line.get('currency'))})});

  var filteredPayments = getFilteredPayments(groupedPayments, configs.filterParameters);

  var updateMonth = function(monthMap, payment)  {
    var person = payment.get('method').split(' ')[1];
    // console.log(payment.get('info'));
    var convertAmountToEuros = function(amount)  {return amount / payment.getIn(['info', 'currency', 'conversion'])};

    var updatePerson = function(personMap)  {
      personMap = personMap.set('totalAmount', personMap.get('totalAmount') + convertAmountToEuros(payment.get('grossAmount')));
      var paymentInfo = Immutable.Map({
        amount: payment.get('grossAmount'),
        currency: payment.getIn(['info', 'currency', 'name']),
        date: payment.get('date')
      });
      personMap = personMap.set('payments', personMap.get('payments').push(paymentInfo));
      return personMap;
    };

    var emptyPerson = Immutable.fromJS(
      {
        name: payment.get('method').split(' ')[1],
        totalAmount: 0,
        payments: []
      }
    );

    monthMap = monthMap.set('totalAmount', monthMap.get('totalAmount') + convertAmountToEuros(payment.get('grossAmount')));
    monthMap = monthMap.updateIn(['people', person], emptyPerson, updatePerson);
    return monthMap;
  };

  var reportWithKeys = filteredPayments.reduce(function(acc, payment)  {
      var dateArray = payment.get('date').split('-');
      var shouldBeInFollowingMonth = dateArray[2] >= 29;
      var monthNumber = parseInt(dateArray[1]) + (shouldBeInFollowingMonth ? 1 : 0);
      var emptyMonth = Immutable.fromJS(
        {
          year: dateArray[0],
          monthNumber: monthNumber,
          month: getVerbalMonth(monthNumber),
          totalAmount: 0,
          people: {}
        }
      );
      return acc.update(getVerbalMonth(monthNumber), emptyMonth, function(monthMap)  {return updateMonth(monthMap, payment)});
    },
    Immutable.Map()
  );

  var report = reportWithKeys.map(function(monthReport)  {return monthReport.set('people', monthReport.get('people'))}).toList();

  return Immutable.Map({creditCards: report.sort(function(a, b)  {return a.get('monthNumber') > b.get('monthNumber')})});
};

module.exports = generateCreditCardsReport;