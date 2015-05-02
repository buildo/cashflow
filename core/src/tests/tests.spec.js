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
            heuristicInstructions: {
              expectedDate: ['2015-04-21', '2015-05-23']
            },
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
  {
    match: (line) => {
      return line.has('payments') && line.get('payments').some((payment) => payment.has('heuristicInstructions') && payment.get('heuristicInstructions').count()>0);
    },
    edit: (line) => {
      const putBigFirst = (interval) => {
        return Immutable.List.isList(interval) && interval.get(1) > interval.get(0) ?
          interval.reverse() : interval;
      };
      const newPayments = line.get('payments').reduce((acc, payment) => {
          const instructions = payment.get('heuristicInstructions');
          const _expectedDate = instructions.get('expectedDate');
          const expectedDate = Immutable.List.isList(_expectedDate) ? _expectedDate : Immutable.List([_expectedDate, _expectedDate]);
          if (expectedDate) {
            payment = payment.set('expectedDate', putBigFirst(expectedDate));
          }
          return acc.push(payment);
        },
        Immutable.List()
      );
      return line.set('payments', newPayments);
    }
  }
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
