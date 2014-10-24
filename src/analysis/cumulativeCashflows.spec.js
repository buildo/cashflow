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
    { date: '2014-12-01', grossAmount: -11 },
    { date: '2014-09-20', grossAmount: 20 },
    { date: '2014-12-10', grossAmount: 31 }
  ],
  history: [
    { date: '2014-05-20', grossAmount: 7 }
  ],
  worst: [
    { date: '2014-11-18', grossAmount: -18 },
    { date: '2014-09-20', grossAmount: 15 },
    { date: '2015-01-25', grossAmount: 31 }
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

  it('should separate payments correctly', () => {
    expect(worst).to.contain.an.item.with.property('grossAmount', 15)
      .and.to.contain.an.item.with.property('grossAmount', -18)
      .and.to.contain.an.item.with.property('date', '2014-11-18');
    expect(best).to.contain.an.item.with.property('grossAmount', 20)
    .and.to.contain.an.item.with.property('grossAmount', -11)
    .and.to.contain.an.item.with.property('date', '2014-12-10');
    expect(historyCashflow).to.contain.an.item.with.property('grossAmount', 7);
  });
});