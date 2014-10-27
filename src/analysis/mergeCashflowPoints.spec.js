'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const collapseCashflows = require('./mergeCashflowPoints.js');

const cashflows = {
  best: [
    {
      date: '2014-12-01',
      grossAmount: -11,
      info: {
        lineId: '1'
      }
    },
    {
      date: '2014-09-20',
      grossAmount: 20,
      info: {
        lineId: '2'
      }
    },
    {
      date: '2014-09-20',
      grossAmount: 31,
      info: {
        lineId: '3'
      }
    }
  ],
  history: [
    {
      date: '2014-05-20',
      grossAmount: 7,
      info: {
        lineId: '2'
      }
    }
  ],
  worst: [
    {
      date: '2014-11-18',
      grossAmount: -18,
      info: {
        lineId: '1'
      }
    },
    {
      date: '2014-09-20',
      grossAmount: 15,
      info: {
        lineId: '2'
      }
    },
    {
      date: '2014-11-18',
      grossAmount: 31,
      info: {
        lineId: '3'
      }
    }
  ]
};

const immutableCashflows = Immutable.fromJS(cashflows);
const report = collapseCashflows(immutableCashflows).toJS();
const output = report.output;
const historyCashflow = output.history;
const best = output.best;
const worst = output.worst;

describe('mergeCashflows', () => {
  it('should return output with three arrays: history, worst, best', () => {
    expect(Array.isArray(historyCashflow)).to.be.true;
    expect(Array.isArray(best)).to.be.true;
    expect(Array.isArray(worst)).to.be.true;
  });

  it('should return output collapsed cashflows', () => {
    expect(historyCashflow).to.have.length(1);
    expect(worst).to.have.length(2);
    expect(best).to.have.length(2);
    expect(best[0]).to.have.property('grossAmount', 51);
    expect(worst[1]).to.have.property('grossAmount', 13);
    expect(Array.isArray(historyCashflow[0].info)).to.be.true;
  });

});