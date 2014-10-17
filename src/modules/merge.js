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

const mergeSourceDescriptions = (immutableCFFs) => {
  return immutableCFFs.reduce((acc, x, index) => {
        return index === immutableCFFs.length - 1 ?
          acc + x.get('sourceDescription') : 
          acc + x.get('sourceDescription') + ', ';
        },
        'merge of: '
  );
};

const mergeCFFs = (immutableCFFs) => {
  const groupedLines = immutableCFFs.map((x) => x.get('lines')).flatten();
  const mergedLines = mergeLines(groupedLines);
  return Immutable.fromJS(
    {
      sourceId: 'MERGE_MODULE',
      sourceDescription: mergeSourceDescriptions(immutableCFFs),
      lines: mergedLines
    }
  );
};

module.exports = mergeCFFs;
