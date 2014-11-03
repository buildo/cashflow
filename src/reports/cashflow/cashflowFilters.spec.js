'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const filterCashflows = require('./cashflowFilters.js');

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
      date: '2014-09-30',
      grossAmount: 15,
      info: [
        {
          lineId: '2'
        }
      ]
    }
  ]
};

const filterParameters = {
  global: {
    dateStart : '2015-08-20'
  },
  cashflow: {
    dateStart: '2014-09-30',
    dateEnd: '2015-09-20'
  }
};

const immutableCashflows = Immutable.fromJS(cashflows);
const report = filterCashflows(immutableCashflows, filterParameters).toJS();
const output = report.cashflow;
const historyCashflow = output.history;
const best = output.best;
const worst = output.worst;

describe('filterCashflows', () => {
  it('should return output with three arrays: history, worst, best', () => {
    expect(Array.isArray(historyCashflow)).to.be.true;
    expect(Array.isArray(best)).to.be.true;
    expect(Array.isArray(worst)).to.be.true;
  });

  it('should filter payments correctly', () => {
    expect(historyCashflow).to.have.length(0);
    expect(best).to.have.length(1);
    expect(worst).to.have.length(2);
    expect(worst).to.contain.an.item.with.property('date', '2014-09-30')
      .and.to.contain.an.item.with.property('date', '2014-11-18');
    expect(best).to.contain.an.item.with.property('date', '2014-12-01');
  });
});