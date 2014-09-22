var assert = require('assert');
XLS = require('xlsjs');
var workbook = XLS.readFile('data/buildo.xls');
var sheet = workbook.Sheets['Contabilità'];
console.log(parseXLSRepresentation(sheet));

function parseXLSRepresentation(data) {
  var lines = parseByLine(data);
  return lines.map(function(l) {
    var netAmount = l.D;
    var vatAmount = l.F || 0;
    var grossAmount = netAmount + vatAmount;
    return {
      id: l.flowDirection + "_" + l.A,
      date: l.B,
      description: l.C,
      netAmount: netAmount,
      vatAmount: vatAmount,
      grossAmount: grossAmount,
      flowDirection: l.flowDirection,
      signedGrossAmount: l.flowDirection == 'out' ? -grossAmount : grossAmount
    }
  });
}

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
  data = parseInOut(data);
  return data;
}

function parseInOut(data) {
  var inOut = undefined;
  for (i in data) {
    if (data[i].A == 'Fatture ricevute') {
      inOut = 'out';
      data.splice(i, 1);
      continue;
    }
    if (data[i].A == 'Fatture emesse') {
      inOut = 'in';
      data.splice(i, 1);
      continue;
    }
    data[i].flowDirection = inOut;
  }
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
