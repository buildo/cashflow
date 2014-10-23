'use strict';

const Immutable = require('immutable');

const comparator = (a, b) => {
  const priorityA = typeof a.get('priority') === 'number' ? a.get('priority') : 0;
  const priorityB = typeof b.get('priority') === 'number' ? b.get('priority') : 0;
  return priorityA - priorityB;
};

const sortByPriorityAscending = (immutableCFFs) => {
  return Immutable.Map(
    {
      output: immutableCFFs.sort(comparator)
    }
  );
};

module.exports = sortByPriorityAscending;