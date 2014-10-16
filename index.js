'use strict';

// const Immutable = require('immutable');
const validateCFF = require('./src/validators/CFFValidator.js');
const mergeCFFs = require('./src/modules/merge.js');

const validateAll = (inputs, validator) => {
  return inputs.reduce(
    (acc, input) => acc.concat(validator(input)),
    []
  );
};

const processInputs = (inputCFFs, heuristics) => validateAll(inputCFFs, validateCFF);

const mergeInputs = (inputCFFs, heuristics) => mergeCFFs(inputCFFs);



module.exports = {
  processInputs: processInputs,
  mergeInputs: mergeInputs
};
