'use strict';

const Immutable = require('immutable');

const validateCff = (cff) => {
  const validators = Immutable.fromJS([
    [
      {
        condition: (cff) => typeof cff !== 'object' || !Array.isArray(cff),
        msg: 'CFF is not a valid JSON object'
      }
    ],[
      {
        condition: (cff) => (typeof cff.sourceId !== 'string'),
        msg: 'sourceId missing or invalid'
      },
      {
        condition: (cff) => (typeof cff.sourceDescription !== 'string'),
        msg: 'sourceDescription missing or invalid'
      }
    ]
  ]);

  /* start writing here*/



  /* finish writing here*/
};

const validateAll = (inputs, validator) => {
  return inputs.reduce(
    (acc, input) => acc.concat(validator(input)),
    []
  );
};

const processInputs = (inputCffs, heuristics) => validateAll(inputCffs, validateCff);

module.exports = (inputCffs, heuristics) => processInputs(inputCffs, heuristics);