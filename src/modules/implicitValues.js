'use strict';

const Immutable = require('immutable');

const updateExpectedAmount = (expectedAmount) => {
  return expectedAmount;
};

const updateAmount = (amount) => {
  const net = amount.get('net');
  const gross = amount.get('gross');
  const vat = amount.get('vat');
  const vatPercentage = amount.get('vatPercentage');

  const equations = {
    net : Immutable.fromJS([gross - vat, gross - gross * vatPercentage, vat / vatPercentage - vat]);
    gross : Immutable.fromJS([net + vat, net / (1 - vatPercentage), vat / vatPercentage]);
    vat : Immutable.fromJS([gross - net, gross * vatPercentage, net / (1 - vatPercentage) - net]);
    vatPercentage : Immutable.fromJS([vat / gross, (gross - net) / gross, vat / (net + vat)]);
  };

  const keys = ['net', 'gross', 'vat', 'vatPercentage'];

  return keys.reduce((acc, key) => {
      const keyValue = typeof amount.get(key) === 'undefined' ? 
        equations['key'].find((x) => typeof x !== 'undefined') : amount.get(key);
      return acc.set(key, keyValue);
    },
    Immutable.fromJS({})
  );
};

const getLinesWithImplicitValues = (lines, updateAmount, updateExpectedAmount) => {
  return lines.reduce((acc, line) => {
      // has amount?
      const amount = line.get('amount');
      if (amount instanceof Immutable.Map && typeof amount.toVector().length >= 2) {
        return acc.push(line.set('amount', updateAmount(amount)));
      }

      // has expectedAmount?
      const expectedAmount = line.get('expectedAmount');
      if (expectedAmount instanceof Immutable.Map) {
        return acc.push(line.set('expectedAmount', updateExpectedAmount(expectedAmount)));
      }

      // default
      return acc;
    },
    Immutable.fromJS([])
  );
};

const insertImplicitValues = (cff) => {
  const newLines = getLinesWithDefaultValues(cff.get('lines'), updateAmount, updateExpectedAmount);
  return cff.set('lines', newLines);
};

module.exports = insertImplicitValues;