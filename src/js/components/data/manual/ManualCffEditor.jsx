/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const JSONEditor = require('jsoneditor');
const ace = require('brace');
require('brace/mode/json');
require('brace/theme/textmate');
const ServerActions = require('../../../actions/ServerActions.js');
const validateCFF = require('../../../../../../cashflow/dist/src/validators/CFFValidator.js');

var editor;

const ManualCffEditor = React.createClass({

  componentDidMount: function() {
    editor = ace.edit('json-editor');
    const json = this.props.manualCFF || {
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
    };
    editor.setOptions({
      mode: 'ace/mode/json',
      theme: 'ace/theme/textmate',
      maxLines: Infinity,
      tabSize: 2,
      autoScrollEditorIntoView: true,
      wrap: true,
    });
    editor.setValue(JSON.stringify(json, undefined, 2));
    editor.clearSelection();
  },

  saveManualCFF: function() {
    const json = JSON.parse(editor.getValue());
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
        <div className='json-editor-container'>
          <div id='json-editor'></div>
        </div>
        <br></br>
      </div>
    );
  },

});

module.exports = ManualCffEditor;