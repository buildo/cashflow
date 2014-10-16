'use strict';

const Immutable = require('immutable');

const mergeLines = (lines) => {
  const groupedLinesMap = lines.reduce(
    (acc, line) => {
      const mergedFrom = typeof acc.get('sourceId') === 'undefined' ? [] : acc.get('sourceId').get('mergedFrom');
      mergedFrom.push(line.get('sourceId'));
      const newLine = line.set('mergedFrom', mergedFrom);
      const sourceId = line.get('sourceId');
      return acc.mergeDeep({sourceId: newLine});
    },
    Immutable.fromJS({})
  );
  return groupedLinesMap.toVector();
};

const mergeCFFs = (inputCFFs) => {
  const groupedLines = Immutable.fromJS(inputCFFs).map((x) => x.get('lines')).flatten();
  const mergedLines = mergeLines(groupedLines);
  return {
    sourceId: 'MERGE_MODULE',
    sourceDescription: 'merge of: fatture in cloud, manual, bperbank',
    lines: mergedLines.toJS()
  };
};

module.exports = mergeCFFs;
