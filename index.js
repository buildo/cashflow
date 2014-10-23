'use strict';

const Immutable = require('immutable');
// modules
const sortByPriority = require('./src/modules/prioritySort.js');
const mergeCFFs = require('./src/modules/merge.js');
const insertDefaultValues = require('./src/modules/defaultValues.js');
const standardizeCFF = require('./src/modules/standardizeInputs.js');
const insertImplicitValues = require('./src/modules/implicitValues.js');
const applyHeuristics = require('./src/modules/heuristics.js');
// validators
const validateCFF = require('./src/validators/CFFValidator.js');
const validateCFFConsistency = require('./src/validators/consistencyValidator.js');
const validateCompletion = require('./src/validators/completionValidator.js');


const processInputs = (inputCFFs, startValue, heuristics) => {

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
    validateCompletion
  ];

  const validateAll = (cffs, validator) => {
    const errors = cffs.reduce(
      (acc, cff) => {
        const cffErrors = validator(cff).get('errors') || [];
        return acc.concat(cffErrors);
      },
      Immutable.Vector()
    );
    return errors.length > 0 ? Immutable.Map({errors: errors}) : Immutable.Map();
  };

  const pushWarnings = (flowObject, warnings) => {
    const oldWarnings = flowObject.get('warnings') || Immutable.Vector();
    return flowObject.set('warnings', oldWarnings.concat(warnings));
  };

  const processedInput = processFunctions.reduce((acc, processFunction) => {
      if (acc.has('errors')) {
        return acc;
      }
      const returnedMap = processFunction(acc.get('output'));
      if (returnedMap.has('errors')) {
        return Immutable.Map({errors: returnedMap.get('errors')});
      }
      if (returnedMap.has('warnings')) {
        acc = pushWarnings(acc, returnedMap.get('warnings'));
      }
      if (returnedMap.has('output')) {
        acc = acc.set('output', returnedMap.get('output'));
      }
      return acc;
    },
    Immutable.Map().set('output', inputCFFs)
  );

  return processedInput.toJS();
};

module.exports = {
  processInputs: processInputs,
};
