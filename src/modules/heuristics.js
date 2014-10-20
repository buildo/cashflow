'use strict';

const Immutable = require('immutable');

const rules = [
  {
    match: (line) => true,
    edit: (line) => line
  }
];

const applyRulesToLines = (lines, rules) => {
  return lines.map((line) => {
    const matchedRules = rules.filter((rule) => rule.match(line));
    return matchedRules.reduce((acc, rule) => rule.edit(acc), line);
  });
};

const applyHeuristics = (cff, heuristics) => applyRulesToLines(cff.get('lines'), rules);

module.exports = applyHeuristics;