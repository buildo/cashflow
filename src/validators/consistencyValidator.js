'use strict';

const Immutable = require('immutable');

const validateValuesMap = (valuesMap) => {
  const filteredValues = valuesMap.filter((value) => typeof value !== 'undefined').toMap();
  const net = filteredValues.get('net');
  const gross = filteredValues.get('gross');
  const vat = filteredValues.get('vat');
  const vatPercentage = filteredValues.get('vatPercentage');

  switch (filteredValues.length) {
    case 3:
      return (net === gross - vat) || (vat === gross - gross * (1 - vatPercentage));
    case 4:
      return (net === gross - vat) && (vat === gross - gross * (1 - vatPercentage));
    default:
      // if length <= 2
      return true;
  }
};

const validators = Immutable.fromJS([
    {
      condition: (line, validateValuesMap) => (line.has('amount') ? validateValuesMap(line.get('amount')) : true),
      msg: 'amount is inconsistent'
    },
    {
      condition: (line, validateValuesMap) => {
        if (!line.has('expectedAmount')) {
          return true;
        }
        const expectedAmount = line.get('expectedAmount');
        const net = expectedAmount.get('net');
        const gross = expectedAmount.get('gross');
        const vat = expectedAmount.get('vat');
        const vatPercentage = expectedAmount.get('vatPercentage');

        return [0, 1].every((index) => {
          const columnValues = Immutable.Map(
            {
              net: net instanceof Immutable.Vector ? net.get(index) : net,
              gross: gross instanceof Immutable.Vector ? gross.get(index) : gross,
              vat: vat instanceof Immutable.Vector ? vat.get(index) : vat,
              vatPercentage: vatPercentage instanceof Immutable.Vector ? vatPercentage.get(index) : vatPercentage
            }
          );
          return validateValuesMap(columnValues);
        });
      },
      msg: 'expectedAmount is inconsistent'
    }
  ]);

const validateLine = (line, validators, validateValuesMap) => {
  return validators.reduce((errors, validator) => {
      const error = Immutable.Map(
        {
          lineId: line.get('id') || 'UNKNOWN_LINE_ID',
          msg: validator.get('msg')
        }
      );
      return !validator.get('condition')(line, validateValuesMap) ? errors.push(error) : errors;
    },
    Immutable.Vector()
  );
};

const validateLines = (cff, validateLine, validators, validateValuesMap) => {
  const errors = cff.get('lines').reduce(
    (errors, line) => errors.concat(validateLine(line, validators, validateValuesMap)),
    Immutable.Vector()
  );
  return errors.length > 0 ? Immutable.Map({errors: errors}) : Immutable.Map();
};

const validateCFFConsistency = (cff) => validateLines(cff, validateLine, validators, validateValuesMap);

module.exports = validateCFFConsistency;
