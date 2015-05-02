'use strict';

var Immutable = require('immutable');

var validateCompletion = function(cff)  {
  // ERRORS: functions and validators needed to check for and return errors
  var validatorBlocks = Immutable.fromJS([
    [
      {
        condition: function(line)  {return Immutable.List.isList(line.get('payments')) && line.get('payments').size > 0},
        msg: 'payments missing or invalid'
      },
      {
        condition: function(line)  {return line.get('flowDirection') === 'in' || line.get('flowDirection') === 'out'},
        msg: 'flowDirection missing or invalid'
      },
      {
        condition: function(line)  {return typeof line.getIn(['currency', 'conversion']) === 'number' && typeof line.getIn(['currency', 'name']) === 'string'},
        msg: 'currency informations missing or invalid'
      }
    ],
    [
      {
        condition: function(line)  {
          return line.get('payments').every(function(payment)  {
            var dateRegExp = /\d\d\d\d-\d\d-\d\d/;
            var dates = Immutable.List().concat(payment.get('date') || payment.get('expectedDate'));
            var isDatesValid = dates.every(function(date)  {return dateRegExp.exec(date)});
            var amounts = Immutable.List().concat(payment.get('grossAmount') || payment.get('expectedGrossAmount'));
            var isAmountsValid = amounts.every(function(amount)  {return typeof amount === 'number'});
            return isDatesValid && isAmountsValid;
          });
        },
        msg: 'one or more payments are incomplete or invalid'
      }
    ]
  ]);

  var getBlockErrors = function(validatorBlock, line)  {
    if (typeof validatorBlock === 'undefined') {
      return Immutable.List();
    }
    return validatorBlock.reduce(
      function(acc, validator)  {
        var error = Immutable.Map(
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

  var throwsErrors = function(validatorBlock, line)  {return getBlockErrors(validatorBlock, line).size > 0};
  var getFirstValidatorBlockWithErrors = function(line) 
    {return validatorBlocks.find(function(validatorBlock)  {return throwsErrors(validatorBlock, line)})};

  // WARNINGS: functions and validators needed to check for and return warnings
  var warningValidators = Immutable.fromJS(
    [
      {
        condition: function(line)  {
          var paymentsGrosses = line.get('payments').reduce(function(acc, payment)  {
              var worstGrossAmount = payment.has('grossAmount') ? payment.get('grossAmount')
                : payment.getIn(['expectedGrossAmount', 0]);
              var bestGrossAmount = payment.has('grossAmount') ? payment.get('grossAmount')
                : payment.getIn(['expectedGrossAmount', 1]);
              acc = typeof worstGrossAmount !== 'undefined' ? (acc.set(0, acc.get(0) + worstGrossAmount)) : acc;
              acc = typeof bestGrossAmount !== 'undefined' ? (acc.set(1, acc.get(1) + bestGrossAmount)) : acc;
              return acc;
            },
            Immutable.List([0, 0])
          );

          var lineWorstGross = line.getIn(['amount','gross']) || line.getIn(['expectedAmount', 'gross', 0]);
          var lineBestGross = line.getIn(['amount','gross']) || line.getIn(['expectedAmount', 'gross', 1]);
          var lineHasGrosses = typeof lineWorstGross !== 'undefined' || typeof lineBestGross !== 'undefined';
          return !lineHasGrosses || lineWorstGross === paymentsGrosses.get(0) || lineBestGross === paymentsGrosses.get(1);
        },
        msg: 'payments inconsistent with amount/expectedAmount'
      }
    ]
  );

  var getWarnings = function(cff)  {
    return cff.get('lines').reduce(function(acc, line)  {
        var lineWarnings = warningValidators.reduce(function(lineWarnings, warningValidator)  {
            var warning = Immutable.Map(
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
  var errors = cff.get('lines').reduce(function(acc, line) 
    {return acc.concat(getBlockErrors(getFirstValidatorBlockWithErrors(line), line))}, Immutable.List());

  if (errors.size > 0) {
    return Immutable.Map({errors: errors});
  }

  var warnings = getWarnings(cff);

  return warnings.size > 0 ? Immutable.Map({warnings: warnings}) : Immutable.Map();
};

module.exports = validateCompletion;
