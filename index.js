'use strict';

const Immutable = require('immutable');
// modules
const sortByPriority = require('./src/modules/prioritySort.js');
const mergeCFFs = require('./src/modules/merge.js');
const insertDefaultValues = require('./src/modules/defaultValues.js');
const standardizeCFF = require('./src/modules/standardizeInputs.js');
const insertImplicitValues = require('./src/modules/implicitValues.js');
const applyHeuristics = require('./src/modules/heuristics.js');
const generateReports = require('./src/modules/report.js');
// validators
const validateCFF = require('./src/validators/CFFValidator.js');
const validateCFFConsistency = require('./src/validators/consistencyValidator.js');
const validateCompletion = require('./src/validators/completionValidator.js');

const processInputs = (inputCFFs, configs, heuristics) => {

  const processFunctions = [
    (cffs) => Immutable.fromJS({output: cffs}),
    (cffs) => validateAll(cffs, validateCFF),
    sortByPriority,
    mergeCFFs,
    validateCFF,
    insertDefaultValues,
    standardizeCFF,
    validateCFFConsistency,
    insertImplicitValues,
    validateCFF,
    validateCFFConsistency,
    (cff) => applyHeuristics(cff, heuristics),
    validateCompletion,
    (cff) => generateReports(cff, configs)
  ];

  const validateAll = (cffs, validator) => {
    const errors = cffs.reduce(
      (acc, cff) => {
        const cffErrors = validator(cff).get('errors') || Immutable.Vector();
        return acc.concat(cffErrors);
      },
      Immutable.Vector()
    );
    return errors.length > 0 ? Immutable.Map({errors: errors}) : Immutable.Map();
  };

  const processedInput = processFunctions.reduce((acc, processFunction) => {
      if (acc.has('errors')) {
        return acc;
      }

      let returnedMap = processFunction(acc.get('output'));
      if (returnedMap.has('errors') && acc.has('errors')) {
        return Immutable.Map({errors: returnedMap.get('errors')});
      }

      // merge wraning
      if (returnedMap.has('warnings')) {
        const previousWarnings = acc.get('warnings') || Immutable.Vector();
        returnedMap = returnedMap.set('warnings', previousWarnings.concat(returnedMap.get('warnings')));
      }

      // replace acc keys
      returnedMap.keySeq().forEach((key) => acc = acc.set(key, returnedMap.get(key)));
      return acc;
    },
    Immutable.Map().set('output', inputCFFs)
  );

  return processedInput.toJS();
};

module.exports = {
  processInputs: processInputs,
};
