'use strict';

var Immutable = require('immutable');

var validateValuesMap = function(valuesMap)  {
  var filteredValues = valuesMap.filter(function(value)  {return typeof value !== 'undefined'});
  var net = filteredValues.get('net');
  var gross = filteredValues.get('gross');
  var vat = filteredValues.get('vat');
  var vatPercentage = filteredValues.get('vatPercentage');

  var tolerance = 0.01;
  switch (filteredValues.size) {
    case 3:
      return (Math.abs(net - (gross - vat)) < tolerance) || (Math.abs(vat - (gross - gross * (1 - vatPercentage))) < tolerance);
    case 4:
      return (Math.abs(net - (gross - vat)) < tolerance) && (Math.abs(vat - (gross - gross * (1 - vatPercentage))) < tolerance);
    default:
      // if size <= 2
      return true;
  }
};

var validators = Immutable.fromJS([
    {
      condition: function(line, validateValuesMap)  {return line.has('amount') ? validateValuesMap(line.get('amount')) : true} ,
      msg: 'amount is inconsistent'
    },
    {
      condition: function(line, validateValuesMap)  {
        if (!line.has('expectedAmount')) {
          return true;
        }
        var expectedAmount = line.get('expectedAmount');
        var net = expectedAmount.get('net');
        var gross = expectedAmount.get('gross');
        var vat = expectedAmount.get('vat');
        var vatPercentage = expectedAmount.get('vatPercentage');

        return [0, 1].every(function(index)  {
          var columnValues = Immutable.Map(
            {
              net: Immutable.List.isList(net) ? net.get(index) : net,
              gross: Immutable.List.isList(gross) ? gross.get(index) : gross,
              vat: Immutable.List.isList(vat) ? vat.get(index) : vat,
              vatPercentage: Immutable.List.isList(vatPercentage) ? vatPercentage.get(index) : vatPercentage
            }
          );
          return validateValuesMap(columnValues);
        });
      },
      msg: 'expectedAmount is inconsistent'
    }
  ]);

var validateLine = function(line, validators, validateValuesMap)  {
  return validators.reduce(function(errors, validator)  {
      var error = Immutable.Map(
        {
          lineId: line.get('id') || 'UNKNOWN_LINE_ID',
          mergedFrom: line.get('mergedFrom'),
          msg: validator.get('msg')
        }
      );
      return !validator.get('condition')(line, validateValuesMap) ? errors.push(error) : errors;
    },
    Immutable.List()
  );
};

var validateLines = function(cff, validateLine, validators, validateValuesMap)  {
  var errors = cff.get('lines').reduce(
    function(errors, line)  {return errors.concat(validateLine(line, validators, validateValuesMap))},
    Immutable.List()
  );
  return errors.size > 0 ? Immutable.Map({errors: errors}) : Immutable.Map();
};

var validateCFFConsistency = function(cff)  {return validateLines(cff, validateLine, validators, validateValuesMap)};

module.exports = validateCFFConsistency;
