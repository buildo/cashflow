'use strict';

const Immutable = require('immutable');

const applyRulesToLines = (lines, rules) => {
  return lines.map((line) => {
    const matchedRules = rules.filter((rule) => rule.match(line));
    return matchedRules.reduce((acc, rule) => rule.edit(acc), line);
  });
};

const applyHeuristicRulesToCFF = (cff, rules) => {
  const editedLines = applyRulesToLines(cff.get('lines'), rules || []);
  return Immutable.Map(
    {
      output: cff.set('lines', editedLines)
    }
  );
};

module.exports = applyHeuristicRulesToCFF;