'use strict';

const Immutable = require('immutable');
const validateCFF = require('./src/validators/CFFValidator.js');
const mergeCFFs = require('./src/modules/merge.js');
const sortByPriority = require('./src/modules/prioritySort.js');

const validateAll = (inputs, validator) => {
  return inputs.reduce(
    (acc, input) => {
      return acc.concat(validator(input));
    },
    Immutable.fromJS([])
  );
};

const mergeInputs = (inputs) => mergeCFFs(inputs);


const processInputs = (inputCFFs, heuristics) => {
  const immutableCFFs = Immutable.fromJS(inputCFFs);
  // CFFs must be valid
  let errors = validateAll(immutableCFFs, validateCFF);
  if(errors.length > 0){
    return errors;
  }
  // sort CFFs by ascending priority
  const sortedCFFs = sortByPriority(immutableCFFs);

  // merge CFFs into one
  const mergedCFF = mergeInputs(sortedCFFs);

  // mergedCFF must still be valid
  errors = validateCFF(mergedCFF);
  if(errors.length > 0){
    return errors;
  }

  return mergedCFF;
  

};

module.exports = {
  processInputs: processInputs,
};
