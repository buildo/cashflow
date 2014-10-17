'use strict';

const Immutable = require('immutable');

const validateCFFConsistency = (cff) => {
  const validators = Immutable.fromJS([
      {
        condition: (line) => {
          const amount = line.get('amount');
          const length = amount.toVector().length;
          if (length > 2) {
            const net = amount.get('net');
            const gross = amount.get('gross');
            const vat = amount.get('vat');
            const vatPercentage = amount.get('vatPercentage');
            switch (length) {
              case 3:
                return (net === gross - vat) || (vat === gross - gross * vatPercentage);
              case 4:
                return (net === gross - vat) && (vat === gross - gross * vatPercentage);
            }
          }
          return true;
        },
        msg: 'Amount is inconsistent'
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