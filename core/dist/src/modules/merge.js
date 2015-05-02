'use strict';

var Immutable = require('immutable');
var UNIQUE_PREFIX = 'cashflow_unique_prefix';

var mergeCFFs = function(immutableCFFs)  {

  var mergeLines = function(lines)  {
    var groupedLinesMap = lines.reduce(
      function(acc, line, index)  {
        var lineID = line.get('id') || (UNIQUE_PREFIX + index);
        var mergedFrom = acc.getIn([lineID, 'mergedFrom']) || Immutable.List();
        var newLine = line.set('mergedFrom', mergedFrom.push(line.get('parentID'))).remove('parentID');
        return acc.mergeDeep(Immutable.Map().set(lineID, newLine));
      },
      Immutable.Map()
    );

    return groupedLinesMap.toIndexedSeq().toList();
  };

  var mergeSourceDescriptions = function(immutableCFFs)  {
    return 'merge of: ' + immutableCFFs.map( function(cff ) {return cff.get('sourceDescription')} ).join(', ');
  };

  var groupedLines = immutableCFFs.flatMap(function(cff)  {
    // save parentID inside each line
    return cff.get('lines').map(function(line)  {return line.set('parentID', cff.get('sourceId'))});
  });

  var mergedCFF = Immutable.Map(
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
