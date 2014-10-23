'use strict';

const Immutable = require('immutable');
const UNIQUE_PREFIX = 'cashflow_unique_prefix';

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
        condition: (cff) => (!cff.has('priority') || typeof cff.get('priority') === 'number'),
        msg: 'priority is invalid'
      },
      {
        condition: (cff) => (cff.get('lines') instanceof Immutable.Vector),
        msg: 'lines missing or not Array'
      }
    ]),
    Immutable.fromJS([
      {
        condition: (cff) => {
          const setOfIds = cff.get('lines').reduce((acc, line, index) => {
            const lineID = line.has('id') ? line.get('id') : (UNIQUE_PREFIX + index);
            return acc.add(lineID);
            },
            Immutable.Set()
          );
          return setOfIds.length === cff.get('lines').length;
        },
        msg: 'lines must have unique IDs (or undefined)'
      }
    ])
  );

  const getBlockErrors = (validatorBlock, cff) => {
    if (typeof validatorBlock === 'undefined') {
      return Immutable.Vector();
    }
    return validatorBlock.reduce(
      (errors, validator) => {
        if (!validator.get('condition')(cff)) {
          errors = errors.push(
            Immutable.Map(
              {
                msg: validator.get('msg'),
                sourceId: (cff instanceof Immutable.Map && cff.has('sourceId')) ?
                  cff.get('sourceId') : 'UNKNOWN_SOURCE_ID'
              }
            )
          );
        }
        return errors;
      },Immutable.Vector()
    );
  };

  const throwsErrors = (validatorBlock, cff) => getBlockErrors(validatorBlock, cff).length > 0;

  const getFirstValidatorBlockWithErrors = (cff) =>
    validatorBlocks.find((validatorBlock) => throwsErrors(validatorBlock, cff));

  const errors = getBlockErrors(getFirstValidatorBlockWithErrors(cff), cff);

  return errors.length > 0 ? Immutable.Map({errors: errors}) : Immutable.Map();
};

module.exports = validateCFF;
