'use strict';

var Immutable = require('immutable');
// modules
var sortByPriority = require('./src/modules/prioritySort.js');
var mergeCFFs = require('./src/modules/merge.js');
var insertDefaultValues = require('./src/modules/defaultValues.js');
var standardizeCFF = require('./src/modules/standardizeInputs.js');
var insertImplicitValues = require('./src/modules/implicitValues.js');
var applyHeuristics = require('./src/modules/heuristics.js');
var generateReports = require('./src/modules/report.js');
// validators
var validateCFF = require('./src/validators/CFFValidator.js');
var validateCFFConsistency = require('./src/validators/consistencyValidator.js');
var validateCompletion = require('./src/validators/completionValidator.js');

var processInputs = function(inputCFFs, configs, heuristics)  {

  var processFunctions = [
    function(cffs)  {return Immutable.fromJS({output: cffs})},
    function(cffs)  {return validateAll(cffs, validateCFF)},
    sortByPriority,
    mergeCFFs,
    validateCFF,
    insertDefaultValues,
    standardizeCFF,
    validateCFFConsistency,
    insertImplicitValues,
    validateCFF,
    validateCFFConsistency,
    function(cff)  {return applyHeuristics(cff, heuristics)},
    validateCompletion,
    function(cff)  {return generateReports(cff, configs)}
  ];

  var validateAll = function(cffs, validator)  {
    var errors = cffs.reduce(
      function(acc, cff)  {
        var cffErrors = validator(cff).get('errors') || Immutable.List();
        return acc.concat(cffErrors);
      },
      Immutable.List()
    );
    return errors.size > 0 ? Immutable.Map({errors: errors}) : Immutable.Map();
  };

  var processedInput = processFunctions.reduce(function(acc, processFunction)  {
      if (acc.has('errors')) {
        return acc;
      }

      var returnedMap = processFunction(acc.get('output'));
      if (returnedMap.has('errors') && acc.has('errors')) {
        return Immutable.Map({errors: returnedMap.get('errors')});
      }

      // merge wraning
      if (returnedMap.has('warnings')) {
        var previousWarnings = acc.get('warnings') || Immutable.List();
        returnedMap = returnedMap.set('warnings', previousWarnings.concat(returnedMap.get('warnings')));
      }

      // replace acc keys
      returnedMap.keySeq().forEach(function(key)  {return acc = acc.set(key, returnedMap.get(key))});
      return acc;
    },
    Immutable.Map().set('output', inputCFFs)
  );

  return processedInput.toJS();
};

module.exports = {
  processInputs: processInputs,
  validateCFF: validateCFF
};
