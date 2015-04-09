'use strict';

var Immutable = require('immutable');

var filterByDate = function(cashflow, filterParamters)  {
  var dateStart = filterParamters.get('dateStart');
  var dateEnd =  filterParamters.get('dateEnd');

  return cashflow.filter(function(point)  {return (!dateStart || point.get('date') >= dateStart) &&
    (!dateEnd || point.get('date') <= dateEnd)});
};

var filterByCompany = function(cashflow, filterParamters)  {
  var companyIds = filterParamters.get('companyIds');
  return cashflow.filter(function(point)  {return !companyIds ||
      typeof companyIds.find(function(id)  {return id === point.getIn(['info', 'company', 'id'])}) !== 'undefined'});
};

var filterByProject = function(cashflow, filterParamters)  {
  var projects = filterParamters.get('projects');
  return cashflow.filter(function(point)  {return !projects ||
      typeof projects.find(function(project)  {return project === point.getIn(['info', 'project'])}) !== 'undefined'});
};

var filterByMethodType = function(cashflow, filterParamters)  {
  var methodTypes = filterParamters.get('methodTypes');
  return cashflow.filter(function(point)  {return !methodTypes ||
      typeof methodTypes.find(function(methodType)  {return methodType === point.getIn(['info', 'methodType'])}) !== 'undefined'});
};

var filterByFlowDirection = function(cashflow, filterParamters)  {
  var flowDirection = filterParamters.get('flowDirection');
  return cashflow.filter(function(point)  {return !flowDirection || flowDirection === point.getIn(['info', 'flowDirection'])});
};


var filterCashflows = function(cashflows, filterParamters)  {
  filterParamters = Immutable.fromJS(filterParamters) || Immutable.Map();
  var globalFilterParameters = filterParamters.get('global') || Immutable.Map();
  var cashflowFilterParameters = filterParamters.get('cashflow') || Immutable.Map();
  var mergedFilterParameters = globalFilterParameters.mergeDeep(cashflowFilterParameters);

  var filters = [
    filterByDate,
    filterByCompany,
    filterByMethodType,
    filterByFlowDirection,
    filterByProject
  ];

  var filteredCashflows = cashflows.map(function(cashflow) 
    {return filters.reduce(function(acc, filter)  {return filter(acc, mergedFilterParameters)}, cashflow)});

  return Immutable.Map({cashflow: filteredCashflows});
};

module.exports = filterCashflows;