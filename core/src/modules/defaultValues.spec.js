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
    },
    {
      id: 'LINE_ID2',
      mergedFrom: ['first','second'],
      currency: {},
      amount: {
        net: 12,
        vat: 3,
        gross: 15,
        vatPercentage: 0.2
      }
    },
    {
      id: 'LINE_ID3',
      mergedFrom: ['first','second'],
      currency: {
        name: 'USD'
      },
      amount: {
        net: 12,
        vat: 3,
        gross: 15,
        vatPercentage: 0.2
      }
    },
    {
      id: 'LINE_ID4',
      mergedFrom: ['first','second'],
      currency: {
        conversion: 1.23
      },
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
const report = insertDefaultValues(immutableMergedCFF).toJS();
const output = report.output;
const lines = output.lines;

describe('insertDefaultValues', () => {
  it('should create property enabled set to true', () => {
    expect(Array.isArray(lines)).to.be.true;
    expect(lines).to.have.length(mergedCFF.lines.length);
    expect(lines[0]).to.have.property('enabled', true);
  });
  it('should create field currency or fill empty ones with name and conversion set to euros', () => {
    expect(lines[0].currency).to.have.property('name', 'EUR');
    expect(lines[0].currency).to.have.property('conversion', 1);
    expect(lines[1].currency).to.have.property('name', 'EUR');
    expect(lines[1].currency).to.have.property('conversion', 1);
  });
  it('should leave incomplete field currency untouched', () => {
    expect(lines[2].currency).to.have.property('name', 'USD');
    expect(lines[2].currency).not.to.have.property('conversion');
    expect(lines[3].currency).not.to.have.property('name');
    expect(lines[3].currency).to.have.property('conversion', 1.23);
  });

});
