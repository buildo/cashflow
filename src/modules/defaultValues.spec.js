'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const insertDefaultValues = require('./defaultValues.js');

describe('insertDefaultValues', () => {
  it('should create property enabled set to true', () => {
    const mergedCFF = {
      sourceId: 'MERGE_MODULE',
      sourceDescription: 'merge of: desc1, desc2',
      priority: 5,
      lines: [
        {
          id: '123',
          mergedFrom: ['first','second'],
          expectedAmount: {
            net: 12,
            vat: 3,
            gross: 15,
            vatPercentage: 0.2
          }
        }
      ]
    };
    const immutableMergedCFF = Immutable.fromJS(mergedCFF);
    const x = insertDefaultValues(immutableMergedCFF).toJS().lines;
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length(1);
    expect(x[0]).to.have.property('enabled', true);
  });
});
