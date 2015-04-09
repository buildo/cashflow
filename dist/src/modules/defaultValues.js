'use strict';

var Immutable = require('immutable');

var getLinesWithDefaultValues = function(lines)  {
  return lines.map(function(line)  {
    line = line.set('enabled', line.has('enabled') ? line.get('enabled') : true);
    line = line.has('currency') && (line.get('currency').has('conversion') || line.get('currency').has('name')) ? line
      : line.set('currency', Immutable.Map({name: 'EUR', conversion: 1}));
    return line;
  });
};

var insertDefaultValues = function(cff)  {
  return Immutable.Map(
    {
      output: cff.set('lines', getLinesWithDefaultValues(cff.get('lines')))
    }
  );
};

module.exports = insertDefaultValues;