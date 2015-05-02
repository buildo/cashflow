'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const insertImplicitValues = require('./implicitValues.js');

const defaultCFF = {
  sourceId: 'MERGE_MODULE',
  sourceDescription: 'merge of: desc1, desc2',
  priority: 5,
  lines: [
    {
      id: 'uniqueID',
      enabled: true,
      mergedFrom: ['first','second'],
      amount: {
        vat: 3,
        gross: 15
      }
    },
    {
      id: 'anotherUniqueId',
      enabled: true,
      mergedFrom: ['second'],
      expectedAmount: {
        vat: [3, 5],
        gross: 15
      }
    }
  ]
};

const immutableDefaultCFF = Immutable.fromJS(defaultCFF);
const report = insertImplicitValues(immutableDefaultCFF).toJS();
const output = report.output;
const lines = output.lines;

describe('insertImplicitValues', () => {
  it('should complete implicit values inside amount and expctedAmount', () => {
    expect(Array.isArray(lines)).to.be.true;
    expect(lines).to.have.length(2);
    expect(lines[0]).to.have.property('amount');
    expect(lines[0].amount).to.have.property('net', 12);
    expect(lines[0].amount).to.have.property('gross', 15);
    expect(lines[0].amount).to.have.property('vat', 3);
    expect(lines[0].amount).to.have.property('vatPercentage', 0.2);
  });
});
