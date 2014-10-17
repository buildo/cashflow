'use strict';

const Immutable = require('immutable');

const getLinesWithDefaultValues = (lines) => {
  return lines.reduce((acc, line) => {
      const expectedAmount = line.get('expectedAmount');
      if (expectedAmount instanceof Immutable.Map && 
        typeof expectedAmount.get('uncertainty') === 'undefined') {
        line = line.set('expectedAmount', expectedAmount.set('uncertainty', 0));
      }
      return acc.push(line);
    },
    Immutable.fromJS([])
  );
};

const insertDefaultValues = (cff) => {
  const newLines = getLinesWithDefaultValues(cff.get('lines'));
  return cff.set('lines', newLines);
};

module.exports = insertDefaultValues;