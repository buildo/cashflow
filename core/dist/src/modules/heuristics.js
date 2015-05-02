'use strict';

var Immutable = require('immutable');

var applyRulesToLines = function(lines, rules)  {
  return lines.map(function(line)  {
    var matchedRules = rules.filter(function(rule)  {return rule.match(line)});
    return matchedRules.reduce(function(acc, rule)  {return rule.edit(acc)}, line);
  });
};

var applyHeuristicRulesToCFF = function(cff, rules)  {
  // short-circuit evaluation for 'rules'
  var editedLines = applyRulesToLines(cff.get('lines'), rules || []);
  return Immutable.Map(
    {
      output: cff.set('lines', editedLines)
    }
  );
};

module.exports = applyHeuristicRulesToCFF;