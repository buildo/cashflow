'use strict';

const Immutable = require('immutable');

const validateCFFConsistency = (cff) => {
  const validators = Immutable.fromJS([
      {
        condition: (line) => {
          const amount = line.get('amount');
          if (line.get('enabled') === false || typeof amount === 'undefined' || amount.toVector().length <= 2){
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
      }
    ]);

  const validateLine = (line) => {
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

  const errors = cff.get('lines').reduce(
    (errors, line) => {
      return errors.concat(validateLine(line));
    },
    Immutable.fromJS([])
  );

  return errors.toVector();

};

module.exports = validateCFFConsistency;