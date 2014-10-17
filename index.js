'use strict';

const Immutable = require('immutable');
const validateCFF = require('./src/validators/CFFValidator.js');
const mergeCFFs = require('./src/modules/merge.js');

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
  const errors = validateAll(immutableCFFs, validateCFF);
  if(errors.length > 0){
    return errors;
  }

  // merge CFFs into one
  const mergedCFF = mergeInputs(immutableCFFs);

  return mergedCFF;
  

  // merged CFF must be still valid
  
  // validateCFF(mergedCFF);

  // 


};




module.exports = {
  processInputs: processInputs,
};
