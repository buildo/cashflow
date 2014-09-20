XLS = require('xlsjs');
var workbook = XLS.readFile('data/buildo.xls');
var sheet = workbook.Sheets['Contabilità'];
console.log(parseByLine(sheet));

function parseByLine(sheet) {
  var data = [];
  for (var i in sheet) {
    var parts = i.split(/([a-z]+)(\d+)/gi).filter(function(a) {return a != ''});
    var cell = sheet[i];
    if (!cell.v) continue;
    if (!data[parts[1]])
      data[parts[1]] = {};
    data[parts[1]][parts[0]] = cell.v;
  }
  return data;
}
