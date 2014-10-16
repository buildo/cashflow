'use strict';

/*globals describe, it */
/*jshint ignore:start*/

const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const indexJS = require('../../index.js');
const processInputs = indexJS.processInputs;
const mergeInputs = indexJS.mergeInputs;


describe('validateCff', () => {
  it('should reject invalid object', () => {
    const inputs = ['string'];
    const x = processInputs(inputs);
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length(1)
      .and.to.contain.an.item.with.property('msg', 'CFF is not a valid JSON object');
    expect(x).to.all.have.property('sourceId', 'UNKNOWN_SOURCE_ID');
  });
  it('should require valid sourceId, sourceDescription and lines', () => {
    const inputs = [{}];
    const x = processInputs(inputs);
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length(3)
      .and.to.contain.an.item.with.property('msg', 'sourceId missing or invalid')
      .and.to.contain.an.item.with.property('msg', 'sourceDescription missing or invalid')
      .and.to.contain.an.item.with.property('msg', 'lines missing or invalid')
      .and.to.all.have.property('sourceId', 'UNKNOWN_SOURCE_ID');
  });
  it('should return errors with sourceId', () => {
    const inputs = [
      {sourceId: '12345'}
    ];
    const x = processInputs(inputs);
    expect(Array.isArray(x)).to.be.true;
    expect(x).to.have.length.at.least(1)
      .and.to.all.have.property('sourceId', '12345');
  });
});


describe('mergeCFFs', () => {
  it('should return new object with sourceId, sourceDescription and lines', () => {
    const cffs = [
      {
        lines: [
          {
            sourceId: '123',
          }
        ]
      },
      {
        lines: [
          {
            sourceId: '123',
          }
        ]
      }
    ];

    const x = mergeInputs(cffs);
    expect(typeof x === 'object').to.be.true;
    expect(x).to.have.property('lines');
    expect(x).to.have.property('sourceId', 'MERGE_MODULE');
    expect(x).to.have.property('sourceDescription');
  });

  it('should return new object with merged lines', () => {
    const cffs = [
      {
        lines: [
          {
            sourceId: '123',
            x: 5,
            y: 7
          }
        ]
      },
      {
        lines: [
          {
            sourceId: '123',
            z: 9,
            y: 3
          }
        ]
      }
    ];

    const x = mergeInputs(cffs).lines;
    expect(x).to.contain.an.item.with.property('x', 5)
      .and.to.contain.an.item.with.property('y', 3)
      .and.to.contain.an.item.with.property('z', 9);
  });

});

/*jshint ignore:end*/