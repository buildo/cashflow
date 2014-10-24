'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const generateCashflows = require('./cashflowsGenerator.js');

const processedInput =
{
  sourceId: 'MERGE_MODULE',
  sourceDescription: 'merge of: desc1, desc2',
  priority: 5,
  lines: [
    {
      id: 'client1',
      flowDirection: 'in',
      payments: [
        {
          date: '2014-05-20',
          grossAmount: 7
        }
      ]
    },
    {
      flowDirection: 'out',
      payments: [
        {
          expectedDate: ['2014-12-01', '2014-11-18'],
          expectedGrossAmount: [11, 18]
        }
      ]
    },
    {
      id: 'client2',
      flowDirection: 'in',
      payments: [
        {
          date: '2014-09-20',
          expectedGrossAmount: [15, 20]
        },
        {
          expectedDate: ['2015-01-25','2014-12-10'],
          grossAmount: 31
        }
      ]
    }
  ]
};

const immutableProcessedInput = Immutable.fromJS(processedInput);
const report = generateCashflows(immutableProcessedInput).toJS();
const output = report.output;
console.log(output);
const historyCashflow = output.history;
const best = output.best;
const worst = output.worst;

describe('generateCashflows', () => {
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