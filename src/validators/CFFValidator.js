'use strict';

const Immutable = require('immutable');

const validateCFF = (cff) => {

  const validatorBlocks = Immutable.fromJS([
    [
      {
        condition: (cff) => (typeof cff === 'object' && !Array.isArray(cff)),
        msg: 'CFF is not a valid JSON object'
      }
    ],
    [
      {
        condition: (cff) => (typeof cff.sourceId === 'string'),
        msg: 'sourceId missing or invalid'
      },
      {
        condition: (cff) => (typeof cff.sourceDescription === 'string'),
        msg: 'sourceDescription missing or invalid'
      },
      {
        condition: (cff) => (Array.isArray(cff.lines)),
        msg: 'lines missing or invalid'
      }
    ]
  ]);

  const getBlockErrors = (validatorBlock, cff) => {
    return validatorBlock.reduce(
      (errors, validator) => {
        if (!validator.get('condition')(cff)) {
          errors.push(
            {
              msg: validator.get('msg'),
              sourceId: cff.sourceId
            }
          );
        }
        return errors;
      },[]
    );
  };

  const throwsErrors = (validatorBlock, cff) => {
    return getBlockErrors(validatorBlock, cff).length > 0;
  };

  const firstValidatorBlockWithErrors = (cff) =>
    Immutable.Sequence(validatorBlocks).find((vb) => throwsErrors(vb, cff));

  return getBlockErrors(firstValidatorBlockWithErrors(cff), cff);
};

module.exports = validateCFF;
