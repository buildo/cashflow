'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const validateCFFConsistency = require('./consistencyValidator.js');

const mergedCFF = {
  sourceId: 'MERGE_MODULE',
  sourceDescription: 'merge of: desc1, desc2',
  priority: 5,
  lines: [
    {
      id: 'cloud',
      enabled: false,
      mergedFrom: ['first','second'],
      amount: {
        net: 12,
        vat: 3,
        gross: 14,
        vatPercentage: 0.2
      },
      expectedAmount: {
        net: [12, 14],
        vat: 3,
        gross: [15, 16]
      },
      invoice: {
        expectedDate: ['2012-03-01', '2012-01-06'],
        date: '2012-01-01',
        number: 17
      }
    }
  ]
};

const immutableMergedCFF = Immutable.fromJS(mergedCFF);
const report = validateCFFConsistency(immutableMergedCFF).toJS();
const errors = report.errors;

describe('validateConsistency', () => {
  it('should reject inconsistent object', () => {
    expect(Array.isArray(errors)).to.be.true;
    expect(errors).to.have.length(2)
      .and.to.contain.an.item.with.property('lineId', 'cloud')
      .and.to.contain.an.item.with.property('msg', 'amount is inconsistent')
      .and.to.contain.an.item.with.property('msg', 'expectedAmount is inconsistent');
  });

});