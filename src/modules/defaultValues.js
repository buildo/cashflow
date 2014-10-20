'use strict';

const Immutable = require('immutable');

const getLinesWithDefaultValues = (lines) => {
  return lines.reduce((acc, line) => {
      const enabled = line.has('enabled') ? line.get('enabled') : true;
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