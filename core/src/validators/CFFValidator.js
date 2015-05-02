'use strict';

const Immutable = require('immutable');
const UNIQUE_PREFIX = 'cashflow_unique_prefix';

const validateCFF = (cff) => {

  const validatorBlocks = Immutable.fromJS([
    [
      {
        condition: (cff) => (Immutable.Map.isMap(cff)),
        msg: 'CFF is not a valid JSON object'
      }
    ],
    [
      {
        condition: (cff) => (typeof cff.get('sourceId') === 'string'),
        msg: 'sourceId missing or invalid'
      },
      {
        condition: (cff) => (typeof cff.get('sourceDescription') === 'string'),
        msg: 'sourceDescription missing or invalid'
      },
      {
        condition: (cff) => (!cff.has('priority') || typeof cff.get('priority') === 'number'),
        msg: 'priority is invalid'
      },
      {
        condition: (cff) => (Immutable.List.isList(cff.get('lines'))),
        msg: 'lines missing or not Array'
      }
    ],
    [
      {
        condition: (cff) => {
          const lines = cff.get('lines');
          const setOfIds = lines.reduce((acc, line, index) => acc.add(line.get('id') || (UNIQUE_PREFIX + index)),
            Immutable.Set());
          return setOfIds.size === lines.size;
        },
        msg: 'lines must have unique IDs (or undefined)'
      }
    ]
  ]);

  const getBlockErrors = (validatorBlock, cff) => {
    if (typeof validatorBlock === 'undefined') {
      return Immutable.List();
    }
    return validatorBlock.reduce(
      (errors, validator) => {
        const error = Immutable.Map(
          {
            msg: validator.get('msg'),
            sourceId: (Immutable.Map.isMap(cff) && cff.has('sourceId')) ?
              cff.get('sourceId') : 'UNKNOWN_SOURCE_ID'
          }
        );
        return !validator.get('condition')(cff) ? errors.push(error) : errors;
      },Immutable.List()
    );
  };

  const throwsErrors = (validatorBlock, cff) => getBlockErrors(validatorBlock, cff).size > 0;

  const getFirstValidatorBlockWithErrors = (cff) =>
    validatorBlocks.find((validatorBlock) => throwsErrors(validatorBlock, cff));

  const errors = getBlockErrors(getFirstValidatorBlockWithErrors(cff), cff);

  return errors.size > 0 ? Immutable.Map({errors: errors}) : Immutable.Map();
};

module.exports = validateCFF;
