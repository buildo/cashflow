'use strict';

const Immutable = require('immutable');

const validators = Immutable.fromJS([
    {
      condition: (line) => {
        const amount = line.get('amount');

        if (line.get('enabled') === false || !(amount instanceof Immutable.Map) || amount.toVector().length <= 2){
          return true;
        }
        const net = amount.get('net');
        const gross = amount.get('gross');
        const vat = amount.get('vat');
        const vatPercentage = amount.get('vatPercentage');
        switch (amount.toVector().length) {
          case 3:
            return (net === gross - vat) || (vat === gross - gross * vatPercentage);
          case 4:
            return (net === gross - vat) && (vat === gross - gross * vatPercentage);
        }
      },
      msg: 'amount is inconsistent'
    },
    {
      condition: (line) => {
        return true;
        // const expectedAmount = line.get('expectedAmount');

        // TODO: expectedAmount.toVector().length <= 2 is not correct
        // if (line.get('enabled') === false || !expectedAmount instanceof Immutable.Map || expectedAmount.toVector().length <= 2){
        //   return true;
        // }

        // const net = expectedAmount.get('net');
        // const gross = expectedAmount.get('gross');
        // const vat = expectedAmount.get('vat');
        // const vatPercentage = expectedAmount.get('vatPercentage');
        // const uncertainty = expectedAmount.get('uncertainty');

        // // TODO: implement logic

        // return true;
      },
      msg: 'expectedAmount is inconsistent'
    }
  ]);

const validateLine = (line, validators) => {
  return validators.reduce((errors, validator) => {
      if (!validator.get('condition')(line)) {
        errors = errors.push(
          {
            id: line.get('id'),
            msg: validator.get('msg')
          }
        );
      }
      return errors;
    },
    Immutable.fromJS([])
  );
};

const validateLines = (cff, validateLine, validators) => {
  const errors = cff.get('lines').reduce(
    (errors, line) => {
      return errors.concat(validateLine(line, validators));
    },
    Immutable.fromJS([])
  );

  return errors.toVector();
};

const validateCFFConsistency = (cff) => validateLines(cff, validateLine, validators);

module.exports = validateCFFConsistency;
