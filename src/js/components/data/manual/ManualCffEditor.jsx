/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const JSONEditor = require('jsoneditor');
const ServerActions = require('../../../actions/ServerActions.js');
const validateCFF = require('../../../../../../cashflow/dist/src/validators/CFFValidator.js');

var editor;

const ManualCffEditor = React.createClass({

  componentDidMount: function() {
    const container = this.refs.jsonEditor.getDOMNode();
    editor = new JSONEditor(container);
    editor.setName('CFF Manuale');
    editor.set(this.props.manualCFF || {
      sourceId: 'MANUAL',
      sourceDescription: 'manual inputs from user',
      lines: [
        {
          id: '12345',
          flowDirection: 'in',
          payments: [
            {
              expectedDate: ['yyyy-mm-dd', 'yyyy-mm-dd'],
              date: 'yyyy-mm-dd',
              expectedGrossAmount: [123, 456],
              grossAmount: 12345
            }
          ]
        }
      ]
    });
    editor.expandAll();
  },

  saveManualCFF: function() {
    const json = editor.get();
    const immutableJSON = Immutable.fromJS(json);
    const validationReport = validateCFF(immutableJSON);
    if (validationReport.has('errors')) {
      console.log('invalid CFF');
      console.log(validationReport.toJS().errors);
    } else {
      ServerActions.saveManual(json);
    }
  },

  render: function () {
    return (
      <div>
        <div className='ui right align positive button' onClick={this.saveManualCFF}>Salva</div>
        <div ref='jsonEditor'></div>
        <br></br>
      </div>
    );
  },

});

module.exports = ManualCffEditor;