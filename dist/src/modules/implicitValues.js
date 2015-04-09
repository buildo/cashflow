'use strict';

var Immutable = require('immutable');

var completeValues = function(valuesMap)  {
  var filteredValues = valuesMap.filter(function(value)  {return typeof value !== 'undefined'});

  if (filteredValues.size < 2) {
    return filteredValues;
  }

  var net = filteredValues.get('net');
  var gross = filteredValues.get('gross');
  var vat = filteredValues.get('vat');
  var vatPercentage = filteredValues.get('vatPercentage');

  var newAmount = Immutable.fromJS(
    {
      net : [net, gross - vat, gross - gross * vatPercentage, vat / vatPercentage - vat],
      gross : [gross, net + vat, net / (1 - vatPercentage), vat / vatPercentage],
      vat : [vat, gross - net, gross * vatPercentage, net / (1 - vatPercentage) - net],
      vatPercentage : [vatPercentage, vat / gross, (gross - net) / gross, vat / (net + vat)]
    }
  );

  return newAmount.map(function(value)  {return value.find(function(x)  {return typeof x !== 'undefined' && !isNaN(x)})});
};

var completeExpectedAmount = function(expectedAmount, completeValues)  {
  var net = expectedAmount.get('net');
  var gross = expectedAmount.get('gross');
  var vat = expectedAmount.get('vat');
  var vatPercentage = expectedAmount.get('vatPercentage');

  var leftValues = Immutable.Map(
    {
      net: Immutable.List.isList(net) ? net.get(0) : net,
      gross: Immutable.List.isList(gross) ? gross.get(0) : gross,
      vat: Immutable.List.isList(vat) ? vat.get(0) : vat,
      vatPercentage: Immutable.List.isList(vatPercentage) ? vatPercentage.get(0) : vatPercentage
    }
  );

  var rightValues = Immutable.Map(
    {
      net: Immutable.List.isList(net) ? net.get(1) : net,
      gross: Immutable.List.isList(gross) ? gross.get(1) : gross,
      vat: Immutable.List.isList(vat) ? vat.get(1) : vat,
      vatPercentage: Immutable.List.isList(vatPercentage) ? vatPercentage.get(1) : vatPercentage
    }
  );

  var completeLeft = completeValues(leftValues);
  var completeRight = completeValues(rightValues);

  return completeLeft.map(function(value, key)  {return Immutable.List([value, completeRight.get(key)])});
};

var getLinesWithImplicitValues = function(lines, completeValues, completeExpectedAmount)  {
  return lines.reduce(function(acc, line)  {
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

var insertImplicitValues = function(cff)  {
  var newLines = getLinesWithImplicitValues(cff.get('lines'), completeValues, completeExpectedAmount);
  return Immutable.Map(
    {
      output: cff.set('lines', newLines)
    }
  );
};

module.exports = insertImplicitValues;
