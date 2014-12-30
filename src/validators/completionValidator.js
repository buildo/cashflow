'use strict';

const Immutable = require('immutable');

const validateCompletion = (cff) => {
  // ERRORS: functions and validators needed to check for and return errors
  const validatorBlocks = Immutable.fromJS([
    [
      {
        condition: (line) => Immutable.List.isList(line.get('payments')) && line.get('payments').size > 0,
        msg: 'payments missing or invalid'
      },
      {
        condition: (line) => line.get('flowDirection') === 'in' || line.get('flowDirection') === 'out',
        msg: 'flowDirection missing or invalid'
      },
      {
        condition: (line) => typeof line.getIn(['currency', 'conversion']) === 'number' && typeof line.getIn(['currency', 'name']) === 'string',
        msg: 'currency informations missing or invalid'
      }
    ],
    [
      {
        condition: (line) => {
          return line.get('payments').every((payment) => {
            const dateRegExp = /\d\d\d\d-\d\d-\d\d/;
            const dates = Immutable.List().concat(payment.get('date') || payment.get('expectedDate'));
            const isDatesValid = dates.every((date) => dateRegExp.exec(date));
            const amounts = Immutable.List().concat(payment.get('grossAmount') || payment.get('expectedGrossAmount'));
            const isAmountsValid = amounts.every((amount) => typeof amount === 'number');
            return isDatesValid && isAmountsValid;
          });
        },
        msg: 'one or more payments are incomplete or invalid'
      }
    ]
  ]);

  const getBlockErrors = (validatorBlock, line) => {
    if (typeof validatorBlock === 'undefined') {
      return Immutable.List();
    }
    return validatorBlock.reduce(
      (acc, validator) => {
        const error = Immutable.Map(
          {
            lineId: line.get('id') || 'UNKNOWN_LINE_ID',
            mergedFrom: line.get('mergedFrom'),
            msg: validator.get('msg'),
          }
        );
        return !validator.get('condition')(line) ? acc.push(error) : acc;
      },Immutable.List()
    );
  };

  const throwsErrors = (validatorBlock, line) => getBlockErrors(validatorBlock, line).size > 0;
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
            Immutable.List([0, 0])
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
          },Immutable.List()
        );
        return acc.concat(lineWarnings);
      },
      Immutable.List()
    );
  };

  // values to return
  const errors = cff.get('lines').reduce((acc, line) =>
    acc.concat(getBlockErrors(getFirstValidatorBlockWithErrors(line), line)), Immutable.List());

  if (errors.size > 0) {
    return Immutable.Map({errors: errors});
  }

  const warnings = getWarnings(cff);

  return warnings.size > 0 ? Immutable.Map({warnings: warnings}) : Immutable.Map();
};

module.exports = validateCompletion;
