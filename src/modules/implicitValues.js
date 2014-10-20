'use strict';

const Immutable = require('immutable');

const completeValues = (valuesMap) => {
  if (valuesMap.toVector().length < 2) {
    return valuesMap;
  }
  
  const net = valuesMap.get('net');
  const gross = valuesMap.get('gross');
  const vat = valuesMap.get('vat');
  const vatPercentage = valuesMap.get('vatPercentage');

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

const completeExpectedAmount = (expectedAmount, completeValues) => {
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

  const completeLeft = completeValues(leftValues);
  const completeRight = completeValues(rightValues);

  return completeLeft.map((value, key) => Immutable.fromJS([value, completeRight.get(key)])).toMap();
};

const getLinesWithImplicitValues = (lines, completeValues, completeExpectedAmount) => {
  return lines.reduce((acc, line) => {
      // has amount?
      const amount = line.get('amount');
      if (amount instanceof Immutable.Map) {
        return acc.push(line.set('amount', completeValues(amount)));
      }

      // has expectedAmount?
      const expectedAmount = line.get('expectedAmount');
      if (expectedAmount instanceof Immutable.Map) {
        return acc.push(line.set('expectedAmount', completeExpectedAmount(expectedAmount, completeValues)));
      }

      // default
      return acc;
    },
    Immutable.Vector()
  );
};

const insertImplicitValues = (cff) => {
  const newLines = getLinesWithImplicitValues(cff.get('lines'), completeValues, completeExpectedAmount);
  return cff.set('lines', newLines);
};

module.exports = insertImplicitValues;
