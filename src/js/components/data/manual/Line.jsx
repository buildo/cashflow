/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const JSONEditor = require('./JSONEditor.jsx');
const ace = require('brace');
require('brace/mode/json');
require('brace/theme/textmate');
const ServerActions = require('../../../actions/ServerActions.js');
const validateCFF = require('../../../../../../cashflow/dist/src/validators/CFFValidator.js');

var editor;

const Line = React.createClass({

  propTypes: {
    key: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    line: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      line: {
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
    };
  },

  componentDidMount: function() {
    editor = ace.edit('json-editor' + this.props.key);
    const json = this.props.line;
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
      ServerActions.saveManualLine(json);
    }
  },

  deleteLine: function() {
    
  },

  render: function () {
    return (
      <div>
        <JSONEditor data={this.props.line} key={this.props.key} ref='jsonEditor'/>
        <div>
          <div className='ui right align negative button' onClick={this.saveLine}>Elimina</div>
          <div className='ui right align positive button' onClick={this.saveLine}>Salva</div>
        </div>
      </div>
    );
  },

});

module.exports = Line;