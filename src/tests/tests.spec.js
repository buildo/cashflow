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
const mergeInputs = require('../modules/merge.js');
const validateAll = require('../validators/CFFValidator.js');

describe('validateCff', () => {
  it('should reject invalid object', () => {
    const inputs = ['string'];
    const x = processInputs(inputs).toJS();
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length(1)
      .and.to.contain.an.item.with.property('msg', 'CFF is not a valid JSON object');
    expect(x).to.all.have.property('sourceId', 'UNKNOWN_SOURCE_ID');
  });
  it('should require valid sourceId, sourceDescription and lines', () => {
    const inputs = [{}];
    const x = processInputs(inputs).toJS();
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length(3)
      .and.to.contain.an.item.with.property('msg', 'sourceId missing or invalid')
      .and.to.contain.an.item.with.property('msg', 'sourceDescription missing or invalid')
      .and.to.contain.an.item.with.property('msg', 'lines missing or not Array')
      .and.to.all.have.property('sourceId', 'UNKNOWN_SOURCE_ID');
  });
  it('should return errors with sourceId', () => {
    const inputs = [
      {sourceId: '12345'}
    ];
    const x = processInputs(inputs).toJS();
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length.at.least(1)
      .and.to.all.have.property('sourceId', '12345');
  });
});


describe('mergeCFFs', () => {
  it('should return new object with sourceId, sourceDescription and lines', () => {
    const cffs = [
      {
        sourceId: '12345',
        sourceDescription: 'desc1',
        lines: [
          {
            id: '123',
            amount: {}
          }
        ]
      },
      {
        sourceId: '12345',
        sourceDescription: 'desc2',
        lines: [
          {
            id: '123',
            amount: {}
          }
        ]
      }
    ];

    const x = processInputs(cffs).toJS();
    expect(x).to.be.an(Object);
    expect(x).to.have.property('sourceDescription', 'merge of: desc1, desc2');
    expect(x).to.have.property('lines');
    expect(x).to.have.property('sourceId', 'MERGE_MODULE');
    expect(x).to.have.property('sourceDescription');
  });

  it('should return new object with merged lines', () => {
    const cffs = [
      {
        sourceId: 'first',
        sourceDescription: 'desc1',
        priority: 5,
        lines: [
          {
            id: '123',
            x: 5,
            amount: {},
            y: 7
          }
        ]
      },
      {
        sourceId: 'second',
        sourceDescription: 'desc2',
        lines: [
          {
            id: '123',
            z: 9,
            amount: {},
            y: 3
          },
          {
            id: '987',
            z: 5,
            expectedAmount: {},
            y: 5
          }
        ]
      }
    ];

    const x = processInputs(cffs).get('lines').toJS();
    expect(x).to.contain.an.item.with.property('id', '123')
      .and.to.contain.an.item.with.property('y', 7)
      .and.to.contain.an.item.with.property('z', 9);
    expect(x).to.contain.an.item.with.property('id', '987');
    expect(x[0].mergedFrom).to.have.length(2);
  });
});

describe('insertDefaultValues', () => {
  it('should create property enabled set to true', () => {
    const mergedCFF = [
      {
        sourceId: 'MERGE_MODULE',
        sourceDescription: 'desc1',
        priority: 5,
        lines: [
          {
            id: '123',
            x: 5,
            expectedAmount: {
              net: 12,
              vat: 3,
              gross: 15,
              vatPercentage: 0.2
            },
            y: 7
          }
        ]
      }
    ];
    const x = processInputs(mergedCFF).toJS().lines;
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length(1);
    expect(x[0]).to.have.property('enabled', true);
  });
});

describe('validateConsistency', () => {
  it('should reject inconsistent object', () => {
    const mergedCFF = [
      {
        sourceId: 'MERGE_MODULE',
        sourceDescription: 'desc1',
        priority: 5,
        lines: [
          {
            id: '123',
            x: 5,
            amount: {
              net: 12,
              vat: 3,
              gross: 14,
              vatPercentage: 0.2
            },
            expectedAmount: {
              net: [12, 14],
              vat: 3,
              gross: [14, 17]
            },
            y: 7
          }
        ]
      }
    ];
    const x = processInputs(mergedCFF).toJS();
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length(2)
      .and.to.contain.an.item.with.property('id', '123')
      .and.to.contain.an.item.with.property('msg', 'amount is inconsistent')
      .and.to.contain.an.item.with.property('msg', 'expectedAmount is inconsistent');
  });
});

describe('insertImplicitValues', () => {
  it('should complete implicit values inside amount and expctedAmount', () => {
    const mergedCFF = [
      {
        sourceId: 'MERGE_MODULE',
        sourceDescription: 'desc1',
        priority: 5,
        lines: [
          {
            id: 'uniqueID',
            amount: {
              vat: 3,
              gross: 15
            }
          },
          {
            id: 'anotherUniqueId',
            expectedAmount: {
              vat: [3, 5],
              gross: 15
            }
          }
        ]
      }
    ];
    const x = processInputs(mergedCFF).toJS().lines;
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length(2);
    expect(x[0]).to.have.property('amount');
    expect(x[0].amount).to.have.property('net', 12);
    expect(x[0].amount).to.have.property('gross', 15);
    expect(x[0].amount).to.have.property('vat', 3);
    expect(x[0].amount).to.have.property('vatPercentage', 0.2);
  });
});
