'use strict';

const Immutable = require('immutable');

const comparator = (a, b) => {
  const priorityA = a.has('priority') ? a.get('priority') : 0;
  const priorityB = b.has('priority') ? b.get('priority') : 0;
  // negative: A before B | 0: not to swap | positive: B before A
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