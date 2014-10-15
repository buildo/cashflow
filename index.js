'use strict';

// const Immutable = require('immutable');
const validateCFF = require('./src/validator/CFFValidator.js');

const validateAll = (inputs, validator) => {
  return inputs.reduce(
    (acc, input) => acc.concat(validator(input)),
    []
  );
};

const processInputs = (inputCFFs, heuristics) => validateAll(inputCFFs, validateCFF);

module.exports = {
  processInputs: processInputs,
};