'use strict';

const Immutable = require('immutable');

const validateCFF = (cff) => {

  const validatorBlocks = Immutable.Sequence(
    Immutable.fromJS([
      {
        condition: (cff) => (cff instanceof Immutable.Map),
        msg: 'CFF is not a valid JSON object'
      }
    ]),
    Immutable.fromJS([
      {
        condition: (cff) => (typeof cff.get('sourceId') === 'string'),
        msg: 'sourceId missing or invalid'
      },
      {
        condition: (cff) => (typeof cff.get('sourceDescription') === 'string'),
        msg: 'sourceDescription missing or invalid'
      },
      {
        condition: (cff) => (cff.get('lines') instanceof Immutable.Vector),
        msg: 'lines missing or invalid'
      }
    ])
  );

  const getBlockErrors = (validatorBlock, cff) => {
    return validatorBlock.reduce(
      (errors, validator) => {
        if (!validator.get('condition')(cff)) {
          errors = errors.push(
            Immutable.fromJS(
              {
                msg: validator.get('msg'),
                sourceId: (cff instanceof Immutable.Map && typeof cff.get('sourceId') !== 'undefined') ? 
                  cff.get('sourceId') : 'UNKNOWN_SOURCE_ID'
              }
            )
          );
        }
        return errors;
      },Immutable.fromJS([])
    );
  };

  const throwsErrors = (validatorBlock, cff) => {
    return getBlockErrors(validatorBlock, cff).length > 0;
  };

  const getFirstValidatorBlockWithErrors = (cff) =>
    validatorBlocks.find((validatorBlock) => throwsErrors(validatorBlock, cff));

  const firstValidatorBlockWithErrors = getFirstValidatorBlockWithErrors(cff);

  return typeof firstValidatorBlockWithErrors === 'undefined' ?
    Immutable.fromJS([]) : getBlockErrors(firstValidatorBlockWithErrors, cff);
};

module.exports = validateCFF;
