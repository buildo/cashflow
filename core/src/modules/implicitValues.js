'use strict';

const Immutable = require('immutable');

const completeValues = (valuesMap) => {
  const filteredValues = valuesMap.filter((value) => typeof value !== 'undefined');

  if (filteredValues.size < 2) {
    return filteredValues;
  }

  const net = filteredValues.get('net');
  const gross = filteredValues.get('gross');
  const vat = filteredValues.get('vat');
  const vatPercentage = filteredValues.get('vatPercentage');

  const newAmount = Immutable.fromJS(
    {
      net : [net, gross - vat, gross - gross * vatPercentage, vat / vatPercentage - vat],
      gross : [gross, net + vat, net / (1 - vatPercentage), vat / vatPercentage],
      vat : [vat, gross - net, gross * vatPercentage, net / (1 - vatPercentage) - net],
      vatPercentage : [vatPercentage, vat / gross, (gross - net) / gross, vat / (net + vat)]
    }
  );

  return newAmount.map((value) => value.find((x) => typeof x !== 'undefined' && !isNaN(x)));
};

const completeExpectedAmount = (expectedAmount, completeValues) => {
  const net = expectedAmount.get('net');
  const gross = expectedAmount.get('gross');
  const vat = expectedAmount.get('vat');
  const vatPercentage = expectedAmount.get('vatPercentage');

  const leftValues = Immutable.Map(
    {
      net: Immutable.List.isList(net) ? net.get(0) : net,
      gross: Immutable.List.isList(gross) ? gross.get(0) : gross,
      vat: Immutable.List.isList(vat) ? vat.get(0) : vat,
      vatPercentage: Immutable.List.isList(vatPercentage) ? vatPercentage.get(0) : vatPercentage
    }
  );

  const rightValues = Immutable.Map(
    {
      net: Immutable.List.isList(net) ? net.get(1) : net,
      gross: Immutable.List.isList(gross) ? gross.get(1) : gross,
      vat: Immutable.List.isList(vat) ? vat.get(1) : vat,
      vatPercentage: Immutable.List.isList(vatPercentage) ? vatPercentage.get(1) : vatPercentage
    }
  );

  const completeLeft = completeValues(leftValues);
  const completeRight = completeValues(rightValues);

  return completeLeft.map((value, key) => Immutable.List([value, completeRight.get(key)]));
};

const getLinesWithImplicitValues = (lines, completeValues, completeExpectedAmount) => {
  return lines.reduce((acc, line) => {
      // has amount?
      line = line.has('amount') ? line.set('amount', completeValues(line.get('amount'))) : line;

      // has expectedAmount?
      line = line.has('expectedAmount') ?
        line.set('expectedAmount',completeExpectedAmount(line.get('expectedAmount'), completeValues)) : line;

      return acc.push(line);
    },
    Immutable.List()
  );
};

const insertImplicitValues = (cff) => {
  const newLines = getLinesWithImplicitValues(cff.get('lines'), completeValues, completeExpectedAmount);
  return Immutable.Map(
    {
      output: cff.set('lines', newLines)
    }
  );
};

module.exports = insertImplicitValues;
