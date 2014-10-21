'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const validateCFFConsistency = require('./consistencyValidator.js');

describe('validateConsistency', () => {
  it('should reject inconsistent object', () => {
    const mergedCFF = {
      sourceId: 'MERGE_MODULE',
      sourceDescription: 'merge of: desc1, desc2',
      priority: 5,
      lines: [
        {
          id: '123',
          enabled: true,
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
        }
      ]
    };
    const immutableMergedCFF = Immutable.fromJS(mergedCFF);
    const x = validateCFFConsistency(immutableMergedCFF).toJS();
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length(2)
      .and.to.contain.an.item.with.property('id', '123')
      .and.to.contain.an.item.with.property('msg', 'amount is inconsistent')
      .and.to.contain.an.item.with.property('msg', 'expectedAmount is inconsistent');
  });
});