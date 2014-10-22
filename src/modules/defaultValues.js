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
  return Immutable.Map(
    {
      cff: cff.set('lines', getLinesWithDefaultValues(cff.get('lines')))
    }
  );
};

module.exports = insertDefaultValues;