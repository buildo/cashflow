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

module.exports = {

  formatDate: formatDate,
  sortPaymentsByDate: sortPaymentsByDate,
  sortByMatchesNumber: sortByMatchesNumber,

};