'use strict';

const Immutable = require('immutable');

const standardizeUserInputs = (cff) => {
  // WARNINGS: functions needed to return warnings
  const intervalValidator = (interval) => !(interval instanceof Immutable.Vector) || (interval.get(0) <= interval.get(1));

  const validateIntervals = (line, intervalValidator) => {
    const invoice = !line.has('invoice') || intervalValidator(line.getIn(['invoice', 'expectedDate']));
    const expectedAmount = !line.has('expectedAmount') ||
      (line.get('expectedAmount').every((value) => intervalValidator(value)));

    const payments = !line.has('payments') ||
      (line.get('payments').every((payment) => {
        return intervalValidator(payment.get('expectedDate')) && intervalValidator(payment.get('expectedGrossAmount'));
      }));

    return invoice && expectedAmount && payments;
  };

  const getCFFWarnings = (cff, validateIntervals, intervalValidator) => {
    return cff.get('lines').reduce((acc, line) => {
        const warning = Immutable.Map(
          {
            lineId: line.get('id') || 'UNKNOWN_LINE_ID',
            msg: 'one or more intervals have left value bigger then right value'
          }
        );
        return validateIntervals(line, intervalValidator) ? acc : acc.push(warning);
      },Immutable.Vector()
    );
  };

  // STANDARDIZER: functions needed to return standardized input
  const putBigFirst = (interval) => {
    return (interval instanceof Immutable.Vector) && interval.get(1) > interval.get(0) ?
      interval.reverse().toVector() : interval;
  };

  const putSmallFirst = (interval) => {
    return (interval instanceof Immutable.Vector) && interval.get(1) < interval.get(0) ?
      interval.reverse().toVector() : interval;
  };

  const standardizeLine = (line, putSmallFirst, putBigFirst) => {

    const keyPathsSmallFirst = [
      ['expectedAmount', 'gross'],
      ['expectedAmount', 'net']
    ];

    const keyPathsBigFirst = [
      ['expectedAmount', 'vat'],
      ['expectedAmount', 'vatPercentage'],
      ['invoice', 'expectedDate']
    ];

    const keyPathsSmallFirstPayments = [
      ['expectedGrossAmount']
    ];

    const keyPathsBigFirstPayments = [
      ['expectedDate'],
    ];

    keyPathsSmallFirst.forEach((accessor) => line = line.updateIn(accessor, putSmallFirst));

    keyPathsBigFirst.forEach((accessor) => line = line.updateIn(accessor, putBigFirst));

    if (line.has('payments')) {
      const standardizedPayments = line.get('payments').reduce((acc, payment) => {
          keyPathsSmallFirstPayments.forEach((accessor) => payment = payment.updateIn(accessor, putSmallFirst));
          keyPathsBigFirstPayments.forEach((accessor) => payment = payment.updateIn(accessor, putBigFirst));
          return acc.push(payment);
        },
        Immutable.Vector()
      );
      line = line.set('payments', standardizedPayments);
    }

    return line;
  };

  const standardizeCFF = (cff, standardizeLine, putSmallFirst, putBigFirst) => {
    const standardizedLines = cff.get('lines').reduce((acc, line) =>
      acc.push(standardizeLine(line, putSmallFirst, putBigFirst)), Immutable.Vector());
    return cff.set('lines', standardizedLines);
  };

  // returned values (warnings returned only if there's any)
  const warnings = getCFFWarnings(cff, validateIntervals, intervalValidator);
  const output = standardizeCFF(cff, standardizeLine, putSmallFirst, putBigFirst);

  return warnings.length > 0 ? Immutable.Map({warnings: warnings, output: output}) : Immutable.Map({output: output});
};

module.exports = standardizeUserInputs;
