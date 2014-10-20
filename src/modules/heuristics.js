'use strict';

const Immutable = require('immutable');

const rules = [
  {
    match: (line) => true,
    apply: (line) => line
  }
];

const applyRulesToLines = (lines, rules) => {
  return lines.map((line) => {
    const matchedRules = rules.filter((rule) => rule.match(line));
    return matchedRules.reduce((acc, rule) => rule.apply(acc), line);
  });
};

const applyHeuristics = (cff) => applyRulesToLines(cff.get('lines'), rules);

module.exports = applyHeuristics;