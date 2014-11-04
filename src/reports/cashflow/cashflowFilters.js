'use strict';

const Immutable = require('immutable');

const filterByDate = (cashflow, filterParamters) => {
  const dateStart = filterParamters.get('dateStart');
  const dateEnd =  filterParamters.get('dateEnd');

  return cashflow.filter((point) => (!dateStart || point.get('date') >= dateStart) &&
    (!dateEnd || point.get('date') <= dateEnd));
};

const filterByCompany = (cashflow, filterParamters) => {
  const companyIds = filterParamters.get('companyIds');
  return cashflow.filter((point) => !companyIds ||
      typeof companyIds.find((id) => id === point.getIn(['info', 'company', 'id'])) !== 'undefined');
};

const filterByMethodType = (cashflow, filterParamters) => {
  const methodTypes = filterParamters.get('methodTypes');
  return cashflow.filter((point) => !methodTypes ||
      typeof methodTypes.find((methodType) => methodType === point.getIn(['info', 'methodType'])) !== 'undefined');
};

const filterByFlowDirection = (cashflow, filterParamters) => {
  const flowDirection = filterParamters.get('flowDirection');
  return cashflow.filter((point) => !flowDirection || flowDirection === point.getIn(['info', 'flowDirection']));
};


const filterCashflows = (cashflows, filterParamters) => {
  filterParamters = Immutable.fromJS(filterParamters) || Immutable.Map();
  const globalFilterParameters = filterParamters.get('global') || Immutable.Map();
  const cashflowFilterParameters = filterParamters.get('cashflow') || Immutable.Map();
  const mergedFilterParameters = globalFilterParameters.mergeDeep(cashflowFilterParameters);

  const filters = [
    filterByDate,
    filterByCompany,
    filterByMethodType,
    filterByFlowDirection
  ];

  const filteredCashflows = cashflows.map((cashflow) =>
    filters.reduce((acc, filter) => filter(acc, mergedFilterParameters), cashflow));

  return Immutable.Map({cashflow: filteredCashflows});
};

module.exports = filterCashflows;