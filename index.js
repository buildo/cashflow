'use strict';

const Immutable = require('immutable');
const validateCFF = require('./src/validators/CFFValidator.js');
const mergeCFFs = require('./src/modules/merge.js');
const sortByPriority = require('./src/modules/prioritySort.js');
const validateCFFConsistency = require('./src/validators/consistencyValidator.js');
const insertDefaultValues = require('./src/modules/defaultValues.js');
const insertImplicitValues = require('./src/modules/implicitValues.js');
const applyHeuristics = require('./src/modules/heuristics.js');
const standardizeCFF = require('./src/modules/standardizeInputs.js');

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

const preMergeFunctions = [
  (cffs) => {
    const x = validateAll(cffs, validateCFF);
    return x;
  },
  sortByPriority
];

const postMergeFunctions = [
  validateCFF,
  insertDefaultValues,
  standardizeCFF,
  validateCFFConsistency,
  insertImplicitValues,
  validateCFF,
  validateCFFConsistency
];

const processInputs = (inputCFFs, startValue, heuristics) => {
  const immutableCFFs = Immutable.fromJS(inputCFFs);

  const updateWarnings = (map, newWarning) => {
    const warnings = map.get('warnings') || Immutable.Vector();
    return map.set('warnings', warnings.concat(newWarning));
  };

  const preMerge = preMergeFunctions.reduce((acc, preMergeFunction) => {
      if (acc.has('errors')) {
        return acc;
      }
      const returnedMap = preMergeFunction(acc.get('cffs'));
      if (returnedMap.has('errors')) {
        return Immutable.Map({errors: returnedMap.get('errors')});
      }
      if (returnedMap.has('warnings')) {
        acc = updateWarnings(acc, returnedMap.get('warnings'));
      }
      if (returnedMap.has('cffs')) {
        acc = acc.set('cffs', returnedMap.get('cffs'));
      }
      return acc;
    },
    Immutable.Map(
      {
        cffs: immutableCFFs
      }
    )
  );

  if (preMerge.has('errors')) {
    return preMerge;
  }

  const mergedCFF = mergeCFFs(preMerge.get('cffs')).get('cff');

  const postMerge = postMergeFunctions.reduce((acc, postMergeFunction) => {
      if (acc.has('errors')) {
        return acc;
      }
      const returnedMap = postMergeFunction(acc.get('cff'));
      if (returnedMap.has('errors')) {
        return Immutable.Map({errors: returnedMap.get('errors')});
      }
      if (returnedMap.has('warnings')) {
        acc = updateWarnings(acc, returnedMap.get('warnings'));
      }
      if (returnedMap.has('cff')) {
        acc = acc.set('cff', returnedMap.get('cff'));
      }

      return acc;
    },
    Immutable.Map(
      {
        cff: mergedCFF
      }
    )
  );

  const heuristicOutput = applyHeuristics(postMerge.get('cff'), heuristics);

  return heuristicOutput;
};

module.exports = {
  processInputs: processInputs,
};
