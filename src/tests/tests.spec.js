'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const indexJS = require('../../index.js');
const processInputs = indexJS.processInputs;

const cffs = [
  {
    sourceId: 'cloud',
    sourceDescription: 'desc1',
    priority: 5,
    lines: [
      {
        id: 'client1',
        amount: {
          net: 12,
          vat: 3,
          gross: 15,
        },
        expectedAmount: {
        net: 12,
        vat: 3,
        gross: 15,
        vatPercentage: 0.2
        }
      },
      {
        amount: {
          net: 12,
          vat: 3,
          gross: 15,
        },
      }
    ]
  },
  {
    sourceId: 'manual',
    sourceDescription: 'desc2',
    lines: [
      {
        id: 'client1',
        amount: {
          net: 9,
          vat: 1,
          gross: 10,
        }
      },
      {
        id: 'client2',
        enabled: false,
        expectedAmount: {
          net: [12, 17],
          vat: 3,
          gross: [15, 20]
        }
      },
      {
        amount: {
          net: 12,
          vat: 3,
          gross: 15,
        },
      }
    ]
  }
];

const heuristicRules = [
  {
    match: (line) => line.has('amount') && line.has('expectedAmount'),
    edit: (line) => line.remove('expectedAmount')
  },
  {
    match: (line) => line.get('mergedFrom').length === 1,
    edit: (line) => line.set('mergedFrom', line.get('mergedFrom').get(0))
  }
];

const startValue = {
  date: '2014-03-20',
  value: 5783.21
};

const report = processInputs(cffs, startValue, heuristicRules);
const output = report.output;
const lines = output.lines;
const lineClient1 = lines[0];
const lineClient2 = lines[1];
const amount = lineClient1.amount;
const expectedAmount = lineClient2.expectedAmount;

describe('CashFlow', () => {
  it('should return report with output and no errors', () => {
    expect(report).to.have.property('output');
    expect(report).to.not.have.property('errors');
  });

  it('should return valid CFF as output', () => {
    expect(Array.isArray(lines)).to.be.true;
    expect(output).to.have.property('sourceDescription', 'merge of: desc2, desc1');
    expect(output).to.have.property('lines');
    expect(output).to.have.property('sourceId', 'MERGE_MODULE');
  });

  it('should return correctly merged CFF', () => {
    expect(lines).to.have.length(4);
    expect(lines).to.contain.an.item.with.property('id', 'client1');
    expect(lines).to.contain.an.item.with.property('id', 'client2');
    expect(amount).to.have.property('net', 12);
  });

  it('should return CFF with default values', () => {
    expect(lineClient1).to.have.property('enabled', true);
    expect(lineClient2).to.have.property('enabled', false);
  });

  it('should return CFF with implicit values', () => {
    expect(amount).to.have.property('vatPercentage', 0.2);
    expect(expectedAmount.vatPercentage[0]).to.equals(0.2);
    expect(expectedAmount.vatPercentage[1]).to.equals(0.15);
  });

  it('should return CFF with edited lines', () => {
    expect(lineClient1).to.not.have.property('expectedAmount');
    expect(lineClient2).to.have.property('mergedFrom', 'manual');
  });
});
