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

        const leftValues = Immutable.fromJS(
          {
            net: net instanceof Immutable.Vector ? net.get(0) : net,
            gross: gross instanceof Immutable.Vector ? gross.get(0) : gross,
            vat: vat instanceof Immutable.Vector ? vat.get(0) : vat,
            vatPercentage: vatPercentage instanceof Immutable.Vector ? vatPercentage.get(0) : vatPercentage
          }
        );

        const rightValues = Immutable.fromJS(
          {
            net: net instanceof Immutable.Vector ? net.get(1) : net,
            gross: gross instanceof Immutable.Vector ? gross.get(1) : gross,
            vat: vat instanceof Immutable.Vector ? vat.get(1) : vat,
            vatPercentage: vatPercentage instanceof Immutable.Vector ? vatPercentage.get(1) : vatPercentage
          }
        );

        return validateValuesMap(leftValues) && validateValuesMap(rightValues);
      },
      msg: 'expectedAmount is inconsistent'
    },
    {
      condition: (line) => {
        const intervalValidator = (interval) => !(interval instanceof Immutable.Vector) || interval.get(1) > interval.get(0);

        return line.every((property) => {
          return property instanceof Immutable.Map ?
            property.every(intervalValidator) : true;
        });
      },
      msg: 'one or more intervals have inconsistent sides'
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
    (errors, line) => {
      return errors.concat(validateLine(line, validators, validateValuesMap));
    },
    Immutable.Vector()
  );

  return errors.toVector();
};

const validateCFFConsistency = (cff) => validateLines(cff, validateLine, validators, validateValuesMap);

module.exports = validateCFFConsistency;
