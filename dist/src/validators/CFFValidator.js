'use strict';

var Immutable = require('immutable');
var UNIQUE_PREFIX = 'cashflow_unique_prefix';

var validateCFF = function(cff)  {

  var validatorBlocks = Immutable.fromJS([
    [
      {
        condition: function(cff)  {return Immutable.Map.isMap(cff)} ,
        msg: 'CFF is not a valid JSON object'
      }
    ],
    [
      {
        condition: function(cff)  {return typeof cff.get('sourceId') === 'string'} ,
        msg: 'sourceId missing or invalid'
      },
      {
        condition: function(cff)  {return typeof cff.get('sourceDescription') === 'string'} ,
        msg: 'sourceDescription missing or invalid'
      },
      {
        condition: function(cff)  {return !cff.has('priority') || typeof cff.get('priority') === 'number'} ,
        msg: 'priority is invalid'
      },
      {
        condition: function(cff)  {return Immutable.List.isList(cff.get('lines'))} ,
        msg: 'lines missing or not Array'
      }
    ],
    [
      {
        condition: function(cff)  {
          var lines = cff.get('lines');
          var setOfIds = lines.reduce(function(acc, line, index)  {return acc.add(line.get('id') || (UNIQUE_PREFIX + index))},
            Immutable.Set());
          return setOfIds.size === lines.size;
        },
        msg: 'lines must have unique IDs (or undefined)'
      }
    ]
  ]);

  var getBlockErrors = function(validatorBlock, cff)  {
    if (typeof validatorBlock === 'undefined') {
      return Immutable.List();
    }
    return validatorBlock.reduce(
      function(errors, validator)  {
        var error = Immutable.Map(
          {
            msg: validator.get('msg'),
            sourceId: (Immutable.Map.isMap(cff) && cff.has('sourceId')) ?
              cff.get('sourceId') : 'UNKNOWN_SOURCE_ID'
          }
        );
        return !validator.get('condition')(cff) ? errors.push(error) : errors;
      },Immutable.List()
    );
  };

  var throwsErrors = function(validatorBlock, cff)  {return getBlockErrors(validatorBlock, cff).size > 0};

  var getFirstValidatorBlockWithErrors = function(cff) 
    {return validatorBlocks.find(function(validatorBlock)  {return throwsErrors(validatorBlock, cff)})};

  var errors = getBlockErrors(getFirstValidatorBlockWithErrors(cff), cff);

  return errors.size > 0 ? Immutable.Map({errors: errors}) : Immutable.Map();
};

module.exports = validateCFF;
