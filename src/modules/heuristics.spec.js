'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const applyHeuristicRules = require('./heuristics.js');

const implicitCFF = {
  sourceId: 'MERGE_MODULE',
  sourceDescription: 'merge of: desc1, desc2',
  priority: 5,
  lines: [
    {
      id: 'client1',
      enabled: true,
      mergedFrom: ['first','second'],
      amount: {
        net: 12,
        vat: 3,
        gross: 15,
        vatPercentage: 0.2
      },
      expectedAmount: {
        net: [12, 10],
        vat: [3, 5],
        gross: [15, 15],
        vatPercentage: [0.2, 0.3]
      }
    },
    {
      id: 'client2',
      enabled: true,
      mergedFrom: ['second'],
      expectedAmount: {
        net: [12, 10],
        vat: [3, 5],
        gross: [15, 15],
        vatPercentage: [0.2, 0.3]
      }
    }
  ]
};

const immutableImplicitCFF = Immutable.fromJS(implicitCFF);

describe('applyHeuristics', () => {
  it('should return unchanged lines', () => {
    // const rules = undefined;
    const report = applyHeuristicRules(immutableImplicitCFF).toJS();
    const output = report.output;
    const lines = output.lines;
    const client1 = lines[0];
    const client2 = lines[1];

    expect(Array.isArray(lines)).to.be.true;
    expect(lines).to.have.length(2);
    expect(client1).to.have.property('expectedAmount');
    expect(Array.isArray(client2.mergedFrom)).to.be.true;
    expect(client2.mergedFrom).to.have.length(1);
  });

  it('should edit matched lines with given heuristics', () => {
    const rules = [
      {
        match: (line) => line.has('amount') && line.has('expectedAmount'),
        edit: (line) => line.remove('expectedAmount')
      },
      {
        match: (line) => line.get('mergedFrom').length === 1,
        edit: (line) => line.set('mergedFrom', line.get('mergedFrom').get(0))
      }
    ];

    const report = applyHeuristicRules(immutableImplicitCFF, rules).toJS();
    const output = report.output;
    const lines = output.lines;
    const client1 = lines[0];
    const client2 = lines[1];

    expect(Array.isArray(lines)).to.be.true;
    expect(lines).to.have.length(2);
    expect(client1).to.not.have.property('expectedAmount');
    expect(client2).to.have.property('mergedFrom', 'second');
  });
});