'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const insertDefaultValues = require('./defaultValues.js');

const mergedCFF = {
  sourceId: 'MERGE_MODULE',
  sourceDescription: 'merge of: desc1, desc2',
  priority: 5,
  lines: [
    {
      id: 'LINE_ID',
      mergedFrom: ['first','second'],
      amount: {
        net: 12,
        vat: 3,
        gross: 15,
        vatPercentage: 0.2
      }
    }
  ]
};

const immutableMergedCFF = Immutable.fromJS(mergedCFF);
const output = insertDefaultValues(immutableMergedCFF).toJS();
const cff = output.cff;
const lines = cff.lines;

describe('insertDefaultValues', () => {
  it('should create property enabled set to true', () => {
    expect(Array.isArray(lines)).to.be.true;
    expect(lines).to.have.length(1);
    expect(lines[0]).to.have.property('enabled', true);
  });
});
