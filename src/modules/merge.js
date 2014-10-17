'use strict';

const Immutable = require('immutable');

const mergeLines = (lines) => {
  const groupedLinesMap = lines.reduce(
    (acc, line) => {
      const mergedFrom = typeof acc.get('id') === 'undefined' ? [] : acc.get('id').get('mergedFrom');
      mergedFrom.push(line.get('id'));
      const newLine = line.set('mergedFrom', mergedFrom);
      return acc.mergeDeep({id: newLine});
    },
    Immutable.fromJS({})
  );
  return groupedLinesMap.toVector();
};

const mergeCFFs = (imutableCFFs) => {
  const groupedLines = imutableCFFs.map((x) => x.get('lines')).flatten();
  const mergedLines = mergeLines(groupedLines);
  return Immutable.fromJS(
    {
      sourceId: 'MERGE_MODULE',
      sourceDescription: 'merge of: fatture in cloud, manual, bperbank',
      lines: mergedLines
    }
  );
};

module.exports = mergeCFFs;
