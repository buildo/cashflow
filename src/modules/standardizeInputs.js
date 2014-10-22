'use strict';

const Immutable = require('immutable');

const standardizeUserInputs = (cff) => {

  const intervalValidator = (interval) => !(interval instanceof Immutable.Vector) || interval.get(1) > interval.get(0);

  const hasSuspiciousIntervals = (line, intervalValidator) => {
    const invoice = line.has('invoice') && !intervalValidator(line.get('invoice').get('expectedDate'));
    const expectedAmount = line.has('expectedAmount') &&
      !(line.get('expectedAmount').every((value) => intervalValidator(value)));

    const payments = line.has('payments') &&
      !(line.get('payments').every((payment) => {
        return !intervalValidator(payments.get('expectedDate')) && !intervalValidator(payments.get('expectedGrossAmount'));
      }));

    return invoice || expectedAmount || payments;
  };

  const getCFFWarnings = (cff, hasSuspiciousIntervals, intervalValidator) => {
    return cff.get('lines').reduce((acc, line) => {
        const warning = Immutable.Map(
          {
            lineID: line.get('id'),
            msg: 'one or more intervals have left value smaller then right value'
          }
        );
        return hasSuspiciousIntervals(line, intervalValidator) ? acc.push(warning) : acc;
      },Immutable.Vector()
    );
  };

  const putBigFirst = (interval) => {
      if (interval instanceof Immutable.Vector) {
        const big = Math.max(interval.get(0), interval.get(1));
        const small = Math.min(interval.get(0), interval.get(1));
        return Immutable.Vector(big, small);
      }
      return interval;
    };

    const putSmallFirst = (interval) => {
      if (interval instanceof Immutable.Vector) {
        const big = Math.max(interval.get(0), interval.get(1));
        const small = Math.min(interval.get(0), interval.get(1));
        return Immutable.Vector(small, big);
      }
      return interval;
    };

  const standardizeLine = (line, putSmallFirst, putBigFirst) => {

    const keyPathsSmallFirst = [
      ['expectedAmount', 'gross'],
      ['expectedAmount', 'net'],
      ['invoice', 'expectedDate']
    ];

    const keyPathsBigFirst = [
      ['expectedAmount', 'vat'],
      ['expectedAmount', 'vatPercentage']
    ];

    const keyPathsSmallFirstPayments = [
      ['expectedDate'],
      ['expectedGrossAmount']
    ];

    keyPathsSmallFirst.forEach((accessor) => {
      line = line.updateIn(accessor, putSmallFirst);
    });

    keyPathsBigFirst.forEach((accessor) => {
      line = line.updateIn(accessor, putBigFirst);
    });

    if (line.has('payments')) {
      const standardizedPayments = line.get('payments').reduce((acc, payment) => {
          keyPathsSmallFirstPayments.forEach((accessor) => payment = payment.updateIn(accessor, putSmallFirst));
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

  return Immutable.Map(
    {
      warnings: getCFFWarnings(cff, hasSuspiciousIntervals, intervalValidator),
      cff: standardizeCFF(cff, standardizeLine, putSmallFirst, putBigFirst)
    }
  );
};

module.exports = standardizeUserInputs;
