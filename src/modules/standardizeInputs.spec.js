'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const standardizeInputs = require('./standardizeInputs.js');

const mergedCFF = {
  sourceId: 'MERGE_MODULE',
  sourceDescription: 'merge of: desc1, desc2',
  priority: 5,
  lines: [
    {
      id: 'LINE_ID',
      enabled: true,
      mergedFrom: ['first','second'],
      expectedAmount: {
        net: [17, 10],
        vat: [3, 5],
        gross: [15, 20],
        vatPercentage: [0.2, 0.15]
      },
      payments: [
        {
          expectedDate: ['2015-2-15','2015-2-20'],
          expectedGrossAmount: [15, 20]
        }
      ]
    }
  ]
};

const immutableMergedCFF = Immutable.fromJS(mergedCFF);
const report = standardizeInputs(immutableMergedCFF).toJS();
const returnedCFF = report.output;
const expectedAmount = returnedCFF.lines[0].expectedAmount;
const returnedWarnings = report.warnings;

describe('standardizeInputs', () => {
  it('should return a Map with three properties: errors, warnings and cff', () => {
    expect(Array.isArray(returnedWarnings)).to.be.true;
    expect(typeof returnedCFF === 'object' && !Array.isArray(returnedCFF)).to.be.true;
  });

  it('should standardize interval values order to [ Worst, Best ]', () => {
    expect(Array.isArray(returnedCFF.lines)).to.be.true;
    expect(expectedAmount.net[0]).to.be.below(expectedAmount.net[1]);
    expect(expectedAmount.gross[0]).to.be.below(expectedAmount.gross[1]);
    expect(expectedAmount.vat[0]).to.be.above(expectedAmount.vat[1]);
    expect(expectedAmount.vatPercentage[0]).to.be.above(expectedAmount.vatPercentage[1]);
  });

  it('should return one warning', () => {
    expect(returnedWarnings).to.have.length(1);
    expect(returnedWarnings[0]).to.have.property('msg', 'one or more intervals have left value smaller then right value');
    expect(returnedWarnings[0]).and.to.have.property('lineId', 'LINE_ID');
  });


  it('should not return any warning', () => {
    const anotherMergedCFF = {
      sourceId: 'MERGE_MODULE',
      sourceDescription: 'merge of: desc1, desc2',
      priority: 5,
      lines: [
        {
          id: 'LINE_ID',
          enabled: true,
          mergedFrom: ['first','second'],
          expectedAmount: {
            net: [10, 17],
            vat: [3, 5],
            gross: [15, 20],
            vatPercentage: [0.15, 0.2]
          }
        }
      ]
    };
    const report = standardizeInputs(Immutable.fromJS(anotherMergedCFF)).toJS();
    const returnedWarnings = report.warnings;
    expect(typeof returnedWarnings === 'undefined').to.be.true;
  });

});
