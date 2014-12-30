'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const completionValidator = require('./completionValidator.js');

const cff = {
  sourceId: 'MERGE_MODULE',
  sourceDescription: 'merge of: desc1, desc2',
  priority: 5,
  lines: [
    {
      id: 'client1',
      enabled: true,
      mergedFrom: ['first','second'],
      expectedAmount: {
        net: [12, 16],
        vat: [4, 4],
        gross: [16, 20],
        vatPercentage: [0.25, 0.2]
      }
    }
  ]
};

describe('validateCompletion', () => {
  it('should return two errors', () => {
    const report = completionValidator(Immutable.fromJS(cff)).toJS();
    const errors = report.errors;

    expect(Array.isArray(errors)).to.be.true;
    expect(errors).to.have.length(3);
    expect(errors).to.contain.an.item.with.property('msg', 'payments missing or invalid')
      .and.to.contain.an.item.with.property('msg', 'flowDirection missing or invalid')
      .and.to.contain.an.item.with.property('msg', 'currency informations missing or invalid');
  });

  it('should return error because has incomplete payments', () => {
    cff.lines[0].payments = [
      {},
      {
        expectedGrossAmount: [5, 12],
        expectedDate: ['2014-02-15','2014-02-20']
      }
    ];
    cff.lines[0].flowDirection = 'in';
    cff.lines[0].currency = {
      name: 'USD',
      conversion: 1.24
    };
    const report = completionValidator(Immutable.fromJS(cff)).toJS();
    const errors = report.errors;

    expect(Array.isArray(errors)).to.be.true;
    expect(errors).to.have.length(1);
    expect(errors).to.contain.an.item.with.property('msg', 'one or more payments are incomplete or invalid');
    expect(errors).to.contain.an.item.with.property('lineId', 'client1');
  });

  it('should return warnings', () => {
    cff.lines[0].payments = [
      {
        expectedGrossAmount: [5, 12],
        expectedDate: ['2016-02-15','2016-02-20']
      }
    ];
    cff.lines[0].flowDirection = 'in';
    cff.lines[0].currency = {
      name: 'USD',
      conversion: 1.24
    };
    const report = completionValidator(Immutable.fromJS(cff)).toJS();
    const warnings = report.warnings;
    expect(Array.isArray(warnings)).to.be.true;
    expect(warnings).to.have.length(1);
    expect(warnings).to.contain.an.item.with.property('msg', 'payments inconsistent with amount/expectedAmount');
  });

  it('should not return warnings nor errors', () => {
    cff.lines[0].amount = {
      gross: 18
    };
    cff.lines[0].payments = [
      {
        expectedGrossAmount: [10, 10],
        expectedDate: ['2016-02-15','2016-02-20']
      },
      {
        grossAmount: 8,
        expectedDate: ['2016-02-15','2016-02-20']
      }
    ];
    cff.lines[0].flowDirection = 'in';
    cff.lines[0].currency = {
      name: 'USD',
      conversion: 1.24
    };
    const report = completionValidator(Immutable.fromJS(cff)).toJS();
    const errors = report.errors;
    const warnings = report.warnings;
    expect(typeof errors === 'undefined').to.be.true;
    expect(typeof warnings === 'undefined').to.be.true;
  });
});
