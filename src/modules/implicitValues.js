'use strict';

const Immutable = require('immutable');

const updateExpectedAmount = (expectedAmount) => {
  return expectedAmount;
};

const updateAmount = (amount) => {
  if (amount.toVector().length < 2) {
    return amount;
  }
  
  const net = amount.get('net');
  const gross = amount.get('gross');
  const vat = amount.get('vat');
  const vatPercentage = amount.get('vatPercentage');

  const newAmount = Immutable.fromJS(
    {
      net : [net, gross - vat, gross - gross * vatPercentage, vat / vatPercentage - vat],
      gross : [gross, net + vat, net / (1 - vatPercentage), vat / vatPercentage],
      vat : [vat, gross - net, gross * vatPercentage, net / (1 - vatPercentage) - net],
      vatPercentage : [vatPercentage, vat / gross, (gross - net) / gross, vat / (net + vat)]
    }
  );

  return newAmount.map((value) => value.find((x) => typeof x !== 'undefined')).toMap();
};

const getLinesWithImplicitValues = (lines, updateAmount, updateExpectedAmount) => {
  return lines.reduce((acc, line) => {
      // has amount?
      const amount = line.get('amount');
      if (amount instanceof Immutable.Map) {
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
  const newLines = getLinesWithImplicitValues(cff.get('lines'), updateAmount, updateExpectedAmount);
  return cff.set('lines', newLines);
};

module.exports = insertImplicitValues;
