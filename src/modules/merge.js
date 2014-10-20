'use strict';

const Immutable = require('immutable');

const mergeCFFs = (immutableCFFs) => {

  const mergeLines = (lines) => {
    const groupedLinesMap = lines.reduce(
      (acc, line) => {
        const lineID = line.get('id');
        const mergedFrom = acc.has(lineID) ? acc.get(lineID).get('mergedFrom') : Immutable.Vector();
        const newLine = line.set('mergedFrom', mergedFrom.push(line.get('parentID'))).remove('parentID');
        return acc.mergeDeep(Immutable.Map().set(lineID, newLine));
      },
      Immutable.Map()
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

  const groupedLines = immutableCFFs.map((cff) => {
      // save parentID inside each line
      return cff.get('lines').map((line) => line.set('parentID', cff.get('sourceId')));
    }).flatten();

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
