'use strict';

var Immutable = require('immutable');

var comparator = function(a, b)  {
  var priorityA = a.has('priority') ? a.get('priority') : 0;
  var priorityB = b.has('priority') ? b.get('priority') : 0;
  // negative: A before B | 0: not to swap | positive: B before A
  return priorityA - priorityB;
};

var sortByPriorityAscending = function(immutableCFFs)  {
  return Immutable.Map(
    {
      output: immutableCFFs.sort(comparator)
    }
  );
};

module.exports = sortByPriorityAscending;