'use strict';

var Immutable = require('immutable');

var initialFilter = function(payments)  {
  return payments.filter(function(payment)  {return payment.has('date') && payment.has('grossAmount') &&
    payment.has('method') && payment.get('methodType') === 'credit card'});
};

var filterByDate = function(payments, filterParameters)  {
  var dateStart = filterParameters.get('dateStart');
  var dateEnd =  filterParameters.get('dateEnd');

  return payments.filter(function(payment)  {return (!dateStart || payment.get('date') >= dateStart) &&
    (!dateEnd || payment.get('date') <= dateEnd)});
};

var filterByPeople = function(payments, filterParameters)  {
  var people = filterParameters.get('people');
  return payments.filter(function(payment)  {return !people ||
      typeof people.find(function(person)  {return person === payment.get('method').split(' ')[1]}) !== 'undefined'});
};

var getFilteredPayments = function(groupedPayments, filterParameters)  {
  filterParameters = Immutable.fromJS(filterParameters) || Immutable.Map();
  var globalFilterParameters = filterParameters.get('global') || Immutable.Map();
  var creditCardsFilterParameters = filterParameters.get('creditCards') || Immutable.Map();
  var mergedFilterParameters = globalFilterParameters.mergeDeep(creditCardsFilterParameters);

  var filters = [
    initialFilter,
    filterByPeople,
    filterByDate
  ];

  return filters.reduce(function(acc, filter)  {return filter(acc, mergedFilterParameters)}, groupedPayments);
};

module.exports = getFilteredPayments;