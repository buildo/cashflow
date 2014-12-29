'use strict';

const formatDate = (date) => {
  const _date = new Date(date);
  return [_date.getDate(), _date.getMonth() + 1, _date.getFullYear()].join('-');
};

const sortByMatchesNumber = (a, b) => (b.matches.length - a.matches.length);

const sortPaymentsByDate = (a, b) => {
  const dateA = new Date((a.date || a.expectedDate[0]));
  const dateB = new Date((b.date || b.expectedDate[0]));
  return dateB.getTime() - dateA.getTime();
};

const getCurrency = (currencyName) => {
  const currencies = {
    EUR: '€',
    USD: '$',
    GBP: '£',
  };
  return currencies[currencyName];
};

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