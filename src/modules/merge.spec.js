'use strict';

/*globals describe, it */
/*jshint expr: true*/

const Immutable = require('immutable');
const assert = require('assert');
const chai = require('chai');
chai.use(require('chai-things'));
const expect = chai.expect;
const mergeCFFs = require('./merge.js');

describe('mergeCFFs', () => {
  it('should return new object with sourceId, sourceDescription and lines', () => {
    const cffs = [
      {
        sourceId: 'cloud',
        sourceDescription: 'desc1',
        lines: [
          {
            id: '123',
            amount: {}
          }
        ]
      },
      {
        sourceId: 'manual',
        sourceDescription: 'desc2',
        lines: [
          {
            id: '123',
            amount: {}
          }
        ]
      }
    ];

    const immutableCFFs = Immutable.fromJS(cffs);
    const x = mergeCFFs(immutableCFFs).toJS();
    expect(x).to.have.property('sourceDescription', 'merge of: desc1, desc2');
    expect(x).to.have.property('lines');
    expect(x).to.have.property('sourceId', 'MERGE_MODULE');
  });

  it('should return new object with merged lines', () => {
    const cffs = [
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
            z: 5,
            expectedAmount: {},
            y: 5
          }
        ]
      },
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
          },
          {
            z: 2,
            amount: {},
            y: 9
          }
        ]
      },
    ];

    const immutableCFFs = Immutable.fromJS(cffs);
    const lines = mergeCFFs(immutableCFFs).get('lines').toJS();
    const mergedLine = lines[2];
    const uniqueLine = lines[0];
    expect(lines).to.have.length(3);
    expect(lines).to.contain.an.item.with.property('id', '123')
      .and.to.contain.an.item.with.property('y', 7)
      .and.to.contain.an.item.with.property('z', 9);
    expect(uniqueLine).to.not.have.property('id');
    expect(mergedLine.mergedFrom).to.have.length(2);
  });
});
