'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const cumulateCashflows = require('./cumulativeCashflows.js');

const cashflows = {
  best: [
    {
      date: '2014-09-20',
      grossAmount: 51,
      info: [
        {
          lineId: '2'
        },
        {
          lineId: '3'
        }
      ]
    },
    {
      date: '2014-12-01',
      grossAmount: -11,
      info: [
        {
          lineId: '1'
        }
      ]
    }
  ],
  history: [
    {
      date: '2014-05-20',
      grossAmount: 340,
      info: [
        {
          lineId: '2'
        },
        {
          description: 'START_VALUE'
        }
      ]
    }
  ],
  worst: [
    {
      date: '2014-11-18',
      grossAmount: 13,
      info: [
        {
          lineId: '1'
        },
        {
          lineId: '2'
        }
      ]
    },
    {
      date: '2014-09-20',
      grossAmount: 15,
      info: [
        {
          lineId: '2'
        }
      ]
    }
  ]
};

const immutableCashflows = Immutable.fromJS(cashflows);
const report = cumulateCashflows(immutableCashflows).toJS();
const output = report.output;
console.log(output);
const historyCashflow = output.history;
const best = output.best;
const worst = output.worst;

describe('cumulateCashflows', () => {
  it('should return output with three arrays: history, worst, best', () => {
    expect(Array.isArray(historyCashflow)).to.be.true;
    expect(Array.isArray(best)).to.be.true;
    expect(Array.isArray(worst)).to.be.true;
  });

  it('should return cumulative cashflows', () => {
    expect(best).to.contain.an.item.with.property('grossAmount', 391)
      .and.to.contain.an.item.with.property('grossAmount', 380);
    expect(worst).to.contain.an.item.with.property('grossAmount', 353)
    .and.to.contain.an.item.with.property('grossAmount', 368);
    expect(historyCashflow).to.contain.an.item.with.property('grossAmount', 340);
  });
});