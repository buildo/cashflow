'use strict';

const Immutable = require('immutable');

const filterByDate = (cashflow, filterParamters) => {
  const dateStart = filterParamters.get('dateStart');
  const dateEnd =  filterParamters.get('dateEnd');

  return cashflow.filter((point) => (!dateStart || point.get('date') >= dateStart) &&
    (!dateEnd || point.get('date') <= dateEnd)).toVector();
};

const filterByCompany = (cashflow, filterParamters) => {
  const companyIds = filterParamters.get('companyIds');
  return cashflow.filter((point) => !companyIds ||
      typeof companyIds.find((id) => id === point.getIn(['info', 'company', 'id'])) !== 'undefined').toVector();
};


const filterCashflows = (cashflows, filterParamters) => {
  filterParamters = Immutable.fromJS(filterParamters) || Immutable.Map();
  const globalFilterParameters = filterParamters.get('global') || Immutable.Map();
  const cashflowFilterParameters = filterParamters.get('cashflow') || Immutable.Map();
  const mergedFilterParameters = globalFilterParameters.mergeDeep(cashflowFilterParameters);

  const filters = [
    filterByDate,
    filterByCompany
  ];

  const filteredCashflows = cashflows.map((cashflow) =>
    filters.reduce((acc, filter) => filter(acc, mergedFilterParameters), cashflow)).toMap();

  return Immutable.Map({cashflow: filteredCashflows});
};

module.exports = filterCashflows;