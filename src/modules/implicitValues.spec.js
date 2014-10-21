'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const insertImplicitValues = require('./implicitValues.js');

describe('insertImplicitValues', () => {
  it('should complete implicit values inside amount and expctedAmount', () => {
    const defaultCFF = {
      sourceId: 'MERGE_MODULE',
      sourceDescription: 'merge of: desc1, desc2',
      priority: 5,
      lines: [
        {
          id: 'uniqueID',
          mergedFrom: ['first','second'],
          amount: {
            vat: 3,
            gross: 15
          }
        },
        {
          id: 'anotherUniqueId',
          mergedFrom: ['second'],        
          expectedAmount: {
            vat: [3, 5],
            gross: 15
          }
        }
      ]
    };

    const immutableDefaultCFF = Immutable.fromJS(defaultCFF);
    const x = insertImplicitValues(immutableDefaultCFF).toJS().lines;

    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length(2);
    expect(x[0]).to.have.property('amount');
    expect(x[0].amount).to.have.property('net', 12);
    expect(x[0].amount).to.have.property('gross', 15);
    expect(x[0].amount).to.have.property('vat', 3);
    expect(x[0].amount).to.have.property('vatPercentage', 0.2);
  });
});
