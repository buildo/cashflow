'use strict';

/*globals describe, it */
/*jshint ignore:start*/

const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const indexJS = require('../../index.js');
const processInputs = indexJS.processInputs;

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
      .and.to.contain.an.item.with.property('msg', 'lines missing or invalid');
  });
});

/*jshint ignore:end*/