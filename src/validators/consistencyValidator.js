'use strict';

const Immutable = require('immutable');

const validateValuesMap = (valuesMap) => {
  const filteredValues = valuesMap.filter((value) => typeof value !== 'undefined');
  const net = filteredValues.get('net');
  const gross = filteredValues.get('gross');
  const vat = filteredValues.get('vat');
  const vatPercentage = filteredValues.get('vatPercentage');

  const tolerance = 0.01;
  switch (filteredValues.size) {
    case 3:
      return (Math.abs(net - (gross - vat)) < tolerance) || (Math.abs(vat - (gross - gross * (1 - vatPercentage))) < tolerance);
    case 4:
      return (Math.abs(net - (gross - vat)) < tolerance) && (Math.abs(vat - (gross - gross * (1 - vatPercentage))) < tolerance);
    default:
      // if size <= 2
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
              net: Immutable.List.isList(net) ? net.get(index) : net,
              gross: Immutable.List.isList(gross) ? gross.get(index) : gross,
              vat: Immutable.List.isList(vat) ? vat.get(index) : vat,
              vatPercentage: Immutable.List.isList(vatPercentage) ? vatPercentage.get(index) : vatPercentage
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
    Immutable.List()
  );
};

const validateLines = (cff, validateLine, validators, validateValuesMap) => {
  const errors = cff.get('lines').reduce(
    (errors, line) => errors.concat(validateLine(line, validators, validateValuesMap)),
    Immutable.List()
  );
  return errors.size > 0 ? Immutable.Map({errors: errors}) : Immutable.Map();
};

const validateCFFConsistency = (cff) => validateLines(cff, validateLine, validators, validateValuesMap);

module.exports = validateCFFConsistency;
