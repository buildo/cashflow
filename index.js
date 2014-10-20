'use strict';

const Immutable = require('immutable');
const validateCFF = require('./src/validators/CFFValidator.js');
const mergeCFFs = require('./src/modules/merge.js');
const sortByPriority = require('./src/modules/prioritySort.js');
const validateCFFConsistency = require('./src/validators/consistencyValidator.js');
const insertDefaultValues = require('./src/modules/defaultValues.js');
const insertImplicitValues = require('./src/modules/implicitValues.js');


const validateAll = (cffs, validator) => {
  return cffs.reduce(
    (acc, cff) => {
      return acc.concat(validator(cff));
    },
    Immutable.Vector()
  );
};

const processInputs = (inputCFFs, heuristics) => {
  const immutableCFFs = Immutable.fromJS(inputCFFs);

  // CFFs must be valid
  let errors = validateAll(immutableCFFs, validateCFF);
  if (errors.length > 0) {
    return errors;
  }

  // sort CFFs by ascending priority
  const sortedCFFs = sortByPriority(immutableCFFs);

  // merge CFFs into one
  const mergedCFF = mergeCFFs(sortedCFFs);

  // mergedCFF must still be valid
  errors = validateCFF(mergedCFF);
  if (errors.length > 0) {
    return errors;
  }

  // insert default values if missing
  const defaultCFF = insertDefaultValues(mergedCFF);

  // validate consistency
  errors = validateCFFConsistency(defaultCFF);
  if (errors.length > 0) {
    return errors;
  }

  // insert implicitValues
  const implicitCFF = insertImplicitValues(defaultCFF);

  // CFF must still be valid...
  errors = validateCFF(mergedCFF);
  if (errors.length > 0) {
    return errors;
  }

  // ...and consistent!
  errors = validateCFFConsistency(mergedCFF);
  if (errors.length > 0) {
    return errors;
  }

  return implicitCFF;
};

module.exports = {
  processInputs: processInputs,
};
