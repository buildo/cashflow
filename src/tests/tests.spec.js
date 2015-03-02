'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const indexJS = require('../../index.js');
const processInputs = indexJS.processInputs;

const cffs = [
  {
    sourceId: 'cloud',
    sourceDescription: 'desc1',
    priority: 5,
    lines: [
      {
        id: 'client1',
        flowDirection: 'in',
        amount: {
          net: 12,
          vat: 3,
          gross: 15,
        },
        expectedAmount: {
        net: 12,
        vat: 3,
        gross: 15,
        vatPercentage: 0.2
        },
        payments: [
          {
            date: '2015-07-20',
            grossAmount: 15
          }
        ]
      },
      {
        flowDirection: 'out',
        amount: {
          net: 12,
          vat: 3,
          gross: 15,
        },
        payments: [
          {
            expectedDate: ['2015-04-20', '2015-05-25'],
            expectedGrossAmount: [15, 30]
          }
        ]
      }
    ]
  },
  {
    sourceId: 'manual',
    sourceDescription: 'desc2',
    lines: [
      {
        id: 'client1',
        flowDirection: 'in',
        amount: {
          net: 9,
          vat: 1,
          gross: 10,
        },
        payments: []
      },
      {
        id: 'client2',
        enabled: false,
        flowDirection: 'in',
        expectedAmount: {
          net: [12, 17],
          vat: 3,
          gross: [15, 20]
        },
        payments: [
          {
            date: '2015-03-20',
            expectedGrossAmount: [20, 15]
          }
        ]
      },
      {
        flowDirection: 'in',
        amount: {
          net: 12,
          vat: 3,
          gross: 15,
        },
        payments: [
          {
            date: '2015-05-10',
            grossAmount: 15
          }
        ]
      }
    ]
  }
];

const heuristicRules = [
  // {
  //   match: (line) => line.has('amount') && line.has('expectedAmount'),
  //   edit: (line) => line.remove('expectedAmount')
  // },
  // {
  //   match: (line) => line.get('mergedFrom').length === 1,
  //   edit: (line) => line.set('mergedFrom', line.getIn(['mergedFrom', 0]))
  // }
];

const configs = {
  startPoint: {
    grossAmount: 200.5,
    date: '2015-01-12'
  }
};

const reports = processInputs(cffs, configs, heuristicRules);
if (typeof reports.errors !== 'undefined') {
  console.log('\nINDEX THROWS ERRORS\n', reports.errors);
}
const cashflow = reports.cashflow;
const warnings = reports.warnings;
const historyFlow = cashflow.history;
const bestFlow = cashflow.best;
const worstFlow = cashflow.worst;

describe('CashFlow', () => {
  it('should return reports with no errors', () => {
    expect(reports).to.have.property('cashflow');
    expect(reports).to.not.have.property('errors');
  });

  it('should return cashflow report with three cashflows', () => {
    expect(Array.isArray(historyFlow)).to.be.true;
    expect(Array.isArray(bestFlow)).to.be.true;
    expect(Array.isArray(worstFlow)).to.be.true;
  });

  it('should return cumulative points', () => {
    expect(historyFlow).to.contain.an.item.with.property('grossAmount', 200.5);
    expect(bestFlow).to.contain.an.item.with.property('grossAmount', 235.5);
    expect(worstFlow).to.contain.an.item.with.property('grossAmount', 215.5);
  });

  it('should return warnings for inconsistent interval sides', () => {
    expect(warnings).to.contain.an.item.with.property('msg', 'one or more intervals have left value bigger then right value');
  });
});
