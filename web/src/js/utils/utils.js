'use strict';

const formatDate = (date) => {
  const _date = new Date(date);
  return [_date.getDate(), _date.getMonth() + 1, _date.getFullYear()].join('-');
};

const sortPaymentsByDate = (a, b) => {
  const dateA = new Date((a.date || a.expectedDate[0]));
  const dateB = new Date((b.date || b.expectedDate[0]));
  return dateB.getTime() - dateA.getTime();
};

const sortByMatchesNumber = (a, b) => {
  if (a.matches.length !== b.matches.length) {
    return (b.matches.length - a.matches.length);
  }
  return sortPaymentsByDate(b, a);
};

const getCurrency = (currencyName) => {
  const currencies = {
    EUR: '€',
    USD: '$',
    GBP: '£',
  };
  return currencies[currencyName];
};

// const getValueInEuro = (payment) {
//   return payment.grossAmount / (payment.info.)
// }

const shiftDate = (dateString, numberOfDays) => {
  if (typeof dateString === 'undefined') {
    return undefined;
  }
  const date = new Date(dateString);
  date.setDate(date.getDate() + numberOfDays);
  return [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join('-');
};

module.exports = {
  formatDate: formatDate,
  sortPaymentsByDate: sortPaymentsByDate,
  sortByMatchesNumber: sortByMatchesNumber,
  getCurrency: getCurrency,
  shiftDate: shiftDate
};