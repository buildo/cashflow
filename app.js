var assert = require('assert');
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
  var data = data.filter(function(a) {
    var firstColumn = a.A;
    return  firstColumn == 'Fatture ricevute' ||
            firstColumn == 'Fatture emesse' ||
            parseInt(firstColumn) === firstColumn;

  }).map(parseXLSDate);
  return data;
}


function parseXLSDate(a) {
  var b = a.B;
  if (!b)
    return a;
  var date = b.split('/');
  assert(date.length == 3, 'invalid date format');
  b = new Date(date[2], date[1], date[0]);
  a.B = b;
  return a;
}
