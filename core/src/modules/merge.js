'use strict';

const Immutable = require('immutable');
const UNIQUE_PREFIX = 'cashflow_unique_prefix';

const mergeCFFs = (immutableCFFs) => {

  const mergeLines = (lines) => {
    const groupedLinesMap = lines.reduce(
      (acc, line, index) => {
        const lineID = line.get('id') || (UNIQUE_PREFIX + index);
        const mergedFrom = acc.getIn([lineID, 'mergedFrom']) || Immutable.List();
        const newLine = line.set('mergedFrom', mergedFrom.push(line.get('parentID'))).remove('parentID');
        return acc.mergeDeep(Immutable.Map().set(lineID, newLine));
      },
      Immutable.Map()
    );

    return groupedLinesMap.toIndexedSeq().toList();
  };

  const mergeSourceDescriptions = (immutableCFFs) => {
    return 'merge of: ' + immutableCFFs.map( cff => cff.get('sourceDescription') ).join(', ');
  };

  const groupedLines = immutableCFFs.flatMap((cff) => {
    // save parentID inside each line
    return cff.get('lines').map((line) => line.set('parentID', cff.get('sourceId')));
  });

  const mergedCFF = Immutable.Map(
    {
      sourceId: 'MERGE_MODULE',
      sourceDescription: mergeSourceDescriptions(immutableCFFs),
      lines: mergeLines(groupedLines)
    }
  );

  return Immutable.Map(
    {
      output: mergedCFF
    }
  );
};

module.exports = mergeCFFs;
