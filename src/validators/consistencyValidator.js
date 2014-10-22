'use strict';

const Immutable = require('immutable');

const validateValuesMap = (valuesMap) => {
  const filteredValues = valuesMap.filter((value) => typeof value !== 'undefined').toMap();
  if (filteredValues.length <= 2){
    return true;
  }

  const net = filteredValues.get('net');
  const gross = filteredValues.get('gross');
  const vat = filteredValues.get('vat');
  const vatPercentage = filteredValues.get('vatPercentage');

  switch (filteredValues.length) {
    case 3:
      return (net === gross - vat) || (vat === gross - gross * (1 - vatPercentage));
    case 4:
      return (net === gross - vat) && (vat === gross - gross * (1 - vatPercentage));
  }
};

const validators = Immutable.fromJS([
    {
      condition: (line, validateValuesMap) => {
        const amount = line.get('amount');
        if(!(amount instanceof Immutable.Map)){
          return true;
        }

        return validateValuesMap(amount);
      },
      msg: 'amount is inconsistent'
    },
    {
      condition: (line, validateValuesMap) => {
        const expectedAmount = line.get('expectedAmount');
        if(!(expectedAmount instanceof Immutable.Map)){
          return true;
        }

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
      if (!validator.get('condition')(line, validateValuesMap)) {
        errors = errors.push(
          {
            id: line.get('id'),
            msg: validator.get('msg')
          }
        );
      }
      return errors;
    },
    Immutable.Vector()
  );
};

const validateLines = (cff, validateLine, validators, validateValuesMap) => {
  const errors = cff.get('lines').reduce(
    (errors, line) => errors.concat(validateLine(line, validators, validateValuesMap)),
    Immutable.Vector()
  );

  return errors.toVector();
};

const validateCFFConsistency = (cff) => validateLines(cff, validateLine, validators, validateValuesMap);

module.exports = validateCFFConsistency;
