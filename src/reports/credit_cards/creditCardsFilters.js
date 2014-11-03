'use strict';

const Immutable = require('immutable');

const initialFilter = (payments) => {
  return payments.filter((payment) => payment.has('date') && payment.has('grossAmount') &&
    payment.has('method') && payment.get('methodType') === 'credit card');
};

const filterByDate = (payments, filterParameters) => {
  const dateStart = filterParameters.get('dateStart');
  const dateEnd =  filterParameters.get('dateEnd');

  return payments.filter((payment) => (!dateStart || payment.get('date') >= dateStart) &&
    (!dateEnd || payment.get('date') <= dateEnd)).toVector();
};

const filterByPeople = (payments, filterParameters) => {
  const people = filterParameters.get('people');
  return payments.filter((payment) => !people ||
      typeof people.find((person) => person === payment.get('method').split(' ')[1]) !== 'undefined').toVector();
};

const getFilteredPayments = (groupedPayments, filterParameters) => {
  filterParameters = Immutable.fromJS(filterParameters) || Immutable.Map();
  const globalFilterParameters = filterParameters.get('global') || Immutable.Map();
  const creditCardsFilterParameters = filterParameters.get('creditCards') || Immutable.Map();
  const mergedFilterParameters = globalFilterParameters.mergeDeep(creditCardsFilterParameters);

  const filters = [
    initialFilter,
    filterByPeople,
    filterByDate
  ];

  return filters.reduce((acc, filter) => filter(acc, mergedFilterParameters), groupedPayments);
};

module.exports = getFilteredPayments;