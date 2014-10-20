'use strict';

const Immutable = require('immutable');

const getLinesWithDefaultValues = (lines) => {
  return lines.reduce((acc, line) => {
      const enabled = typeof line.get('enabled') === 'undefined' ? true : line.get('enabled');
      return acc.push(line.set('enabled', enabled));
    },
    Immutable.Vector()
  );
};

const insertDefaultValues = (cff) => {
  const newLines = getLinesWithDefaultValues(cff.get('lines'));
  return cff.set('lines', newLines);
};

module.exports = insertDefaultValues;