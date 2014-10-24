'use strict';

const Immutable = require('immutable');

const validateCompletion = (cff) => {
  // ERRORS: functions and validators needed to check for and return errors
  const validatorBlocks = Immutable.Sequence(
    Immutable.fromJS([
      {
        condition: (line) => line.get('payments') instanceof Immutable.Vector && line.get('payments').length > 0,
        msg: 'payments missing or invalid'
      },
      {
        condition: (line) => line.get('flowDirection') === 'in' || line.get('flowDirection') === 'out',
        msg: 'flowDirection missing or invalid'
      }
    ]),
    Immutable.fromJS([
      {
        condition: (line) => {
          return line.get('payments').every((payment) => (payment.has('date') || payment.has('expectedDate')) &&
            (payment.has('grossAmount') || payment.has('expectedGrossAmount')));
        },
        msg: 'one or more payments are incomplete'
      }
    ]),
    Immutable.fromJS([
      {
        condition: (line) => line.get('payments').every((payment) => {
          const farthestDate = payment.get('date') || payment.getIn(['expectedDate', 0]);
          const today = new Date();
          const todayFormatted = [today.getFullYear(), ('0' + today.getMonth() + 1).slice(-2), ('0' + today.getDate()).slice(-2)].join('-');

          return payment.has('date') ? farthestDate > todayFormatted || payment.has('grossAmount')
            : farthestDate > todayFormatted;
        }),
        msg: 'one or more payments with passed farthest date have not been updated'
      }
    ])
  );

  const getBlockErrors = (validatorBlock, line) => {
    if (typeof validatorBlock === 'undefined') {
      return Immutable.Vector();
    }
    return validatorBlock.reduce(
      (acc, validator) => {
        const error = Immutable.Map(
          {
            lineId: line.get('id') || 'UNKNOWN_LINE_ID',
            msg: validator.get('msg'),
          }
        );
        return !validator.get('condition')(line) ? acc.push(error) : acc;
      },Immutable.Vector()
    );
  };

  const throwsErrors = (validatorBlock, line) => getBlockErrors(validatorBlock, line).length > 0;
  const getFirstValidatorBlockWithErrors = (line) =>
    validatorBlocks.find((validatorBlock) => throwsErrors(validatorBlock, line));

  // WARNINGS: functions and validators needed to check for and return warnings
  const warningValidators = Immutable.fromJS(
    [
      {
        condition: (line) => {
          const paymentsGrosses = line.get('payments').reduce((acc, payment) => {
              const worstGrossAmount = payment.has('grossAmount') ? payment.get('grossAmount')
                : payment.getIn(['expectedGrossAmount', 0]);
              const bestGrossAmount = payment.has('grossAmount') ? payment.get('grossAmount')
                : payment.getIn(['expectedGrossAmount', 1]);
              acc = typeof worstGrossAmount !== 'undefined' ? (acc.set(0, acc.get(0) + worstGrossAmount)) : acc;
              acc = typeof bestGrossAmount !== 'undefined' ? (acc.set(1, acc.get(1) + bestGrossAmount)) : acc;
              return acc;
            },
            Immutable.Vector(0, 0)
          );

          const lineWorstGross = line.getIn(['amount','gross']) || line.getIn(['expectedAmount', 'gross', 0]);
          const lineBestGross = line.getIn(['amount','gross']) || line.getIn(['expectedAmount', 'gross', 1]);
          const lineHasGrosses = typeof lineWorstGross !== 'undefined' || typeof lineBestGross !== 'undefined';
          return !lineHasGrosses || lineWorstGross === paymentsGrosses.get(0) || lineBestGross === paymentsGrosses.get(1);
        },
        msg: 'payments inconsistent with amount/expectedAmount'
      }
    ]
  );

  const getWarnings = (cff) => {
    return cff.get('lines').reduce((acc, line) => {
        const lineWarnings = warningValidators.reduce((lineWarnings, warningValidator) => {
            const warning = Immutable.Map(
              {
                lineId: line.get('id') || 'UNKNOWN_LINE_ID',
                msg: warningValidator.get('msg')
              }
            );
            return !warningValidator.get('condition')(line) ? lineWarnings.push(warning) : lineWarnings;
          },Immutable.Vector()
        );
        return acc.concat(lineWarnings);
      },
      Immutable.Vector()
    );
  };

  // values to return
  const errors = cff.get('lines').reduce((acc, line) =>
    acc.concat(getBlockErrors(getFirstValidatorBlockWithErrors(line), line)), Immutable.Vector());

  if (errors.length > 0) {
    return Immutable.Map({errors: errors});
  }

  const warnings = getWarnings(cff);

  return warnings.length > 0 ? Immutable.Map({warnings: warnings}) : Immutable.Map();
};

module.exports = validateCompletion;
