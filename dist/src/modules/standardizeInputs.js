'use strict';

var Immutable = require('immutable');

var standardizeUserInputs = function(cff)  {
  // WARNINGS: functions needed to return warnings

  var intervalValidator = function(interval)  {return !Immutable.List.isList(interval) || (interval.get(0) <= interval.get(1))};

  var validateIntervals = function(line, intervalValidator)  {
    var invoice = !line.has('invoice') || intervalValidator(line.getIn(['invoice', 'expectedDate']));
    var expectedAmount = !line.has('expectedAmount') ||
      (line.get('expectedAmount').every(function(value)  {return intervalValidator(value)}));

    var payments = !line.has('payments') ||
      (line.get('payments').every(function(payment)  {
        return intervalValidator(payment.get('expectedDate')) && intervalValidator(payment.get('expectedGrossAmount'));
      }));

    return invoice && expectedAmount && payments;
  };

  var getCFFWarnings = function(cff, validateIntervals, intervalValidator)  {
    return cff.get('lines').reduce(function(acc, line)  {
        var warning = Immutable.Map(
          {
            lineId: line.get('id') || 'UNKNOWN_LINE_ID',
            msg: 'one or more intervals have left value bigger then right value'
          }
        );
        return validateIntervals(line, intervalValidator) ? acc : acc.push(warning);
      },Immutable.List()
    );
  };

  // STANDARDIZERS: functions needed to return standardized input
  var standardizeIntervals = function(line)  {
    var putBigFirst = function(interval)  {
      return Immutable.List.isList(interval) && interval.get(1) > interval.get(0) ?
        interval.reverse() : interval;
    };
    var putSmallFirst = function(interval)  {
      return Immutable.List.isList(interval) && interval.get(1) < interval.get(0) ?
        interval.reverse() : interval;
    };

    var keyPathsSmallFirst = [
      ['expectedAmount', 'gross'],
      ['expectedAmount', 'net'],
      ['expectedGrossAmount']
    ];

    var keyPathsBigFirst = [
      ['expectedAmount', 'vat'],
      ['expectedAmount', 'vatPercentage'],
      ['invoice', 'expectedDate'],
      ['expectedDate'],
    ];

    keyPathsSmallFirst.forEach(function(accessor)  {return line = line.updateIn(accessor, putSmallFirst)});
    keyPathsBigFirst.forEach(function(accessor)  {return line = line.updateIn(accessor, putBigFirst)});

    if (line.has('payments')) {
      var standardizedPayments = line.get('payments').reduce(function(acc, payment)  {
          keyPathsSmallFirst.forEach(function(accessor)  {return payment = payment.updateIn(accessor, putSmallFirst)});
          keyPathsBigFirst.forEach(function(accessor)  {return payment = payment.updateIn(accessor, putBigFirst)});
          return acc.push(payment);
        },
        Immutable.List()
      );
      line = line.set('payments', standardizedPayments);
    }
    return line;
  };

  var standardizeCFF = function(cff)  {
    var standardizers = [
      standardizeIntervals
    ];

    var standardizedLines = standardizers.reduce(function(acc, standardizer)  {return acc.map(function(line)  {return standardizer(line)})}, cff.get('lines'));
    return cff.set('lines', standardizedLines);
  };

  // returned values (warnings returned only if there's any)
  var warnings = getCFFWarnings(cff, validateIntervals, intervalValidator);
  var output = standardizeCFF(cff);

  return warnings.size > 0 ? Immutable.Map({warnings: warnings, output: output}) : Immutable.Map({output: output});
};

module.exports = standardizeUserInputs;
