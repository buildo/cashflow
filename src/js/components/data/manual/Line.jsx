/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const JSONEditor = require('./JSONEditor.jsx');
const CFFActions = require('../../../actions/CFFActions.js');
const validateCFF = require('../../../../../../cashflow/dist/src/validators/CFFValidator.js');

const Line = React.createClass({

  propTypes: {
    id: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    line: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      line: {
        id: '',
        flowDirection: 'in/out',
        payments: [
          {
            expectedDate: ['yyyy-mm-dd', 'yyyy-mm-dd'],
            date: 'yyyy-mm-dd',
            expectedGrossAmount: [0, 0],
            grossAmount: 0
          }
        ]
      }
    };
  },

  saveLine: function() {
    const value = this.refs.jsonEditor.getValue();
    const json = JSON.parse(value);
    const fakeCFF = {
      sourceId: 'MANUAL',
      sourceDescription: 'manual inputs from user',
      lines: [json]
    };
    const immutableJSON = Immutable.fromJS(fakeCFF);
    const validationReport = validateCFF(immutableJSON);
    if (validationReport.has('errors')) {
      console.log('invalid CFF');
      console.log(validationReport.toJS().errors);
    } else {
      console.log(json);
      CFFActions.saveManualLine(json);
    }
  },

  deleteLine: function() {
    
  },

  render: function () {
    return (
      <div className='ui segment'>
        <JSONEditor data={this.props.line} id={this.props.id} ref='jsonEditor'/>
        <div>
          <div className='ui right align negative button' onClick={this.saveLine}>Elimina</div>
          <div className='ui right align positive button' onClick={this.saveLine}>Salva</div>
        </div>
      </div>
    );
  },

});

module.exports = Line;