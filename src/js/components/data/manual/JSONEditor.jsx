/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const ace = require('brace');
require('brace/mode/json');
require('brace/theme/textmate');
const validateCFF = require('../../../../../../cashflow/dist/src/validators/CFFValidator.js');

var editor;

const JSONEditor = React.createClass({

  propTypes: {
    id: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    data: React.PropTypes.object.isRequired,
    onDocumentChange: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      initialData: this.props.data || {},
      id: this.props.id || ('' + (new Date()).getTime())
    };
  },

  componentDidMount: function() {
    this.setValue(this.state.initialData);
  },

  getValue: function() {
    return editor.getValue();
  },

  resetData: function() {
    editor.destroy();
    this.setValue(this.state.initialData);
  },

  setValue: function(data) {
    editor = ace.edit('json-editor' + this.state.id);
    editor.setOptions({
      mode: 'ace/mode/json',
      theme: 'ace/theme/textmate',
      maxLines: Infinity,
      tabSize: 2,
      autoScrollEditorIntoView: true,
      wrap: true
    });
    editor.setValue(JSON.stringify(data, undefined, 2));
    editor.on('change', this.props.onDocumentChange, false);
    editor.clearSelection();
  },

  render: function () {
    return (
      <div className='json-editor-container'>
        <div className='json-editor' id={'json-editor' + this.state.id}></div>
      </div>
    );
  },

});

module.exports = JSONEditor;