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
    data: React.PropTypes.object.isRequired
  },

  componentDidMount: function() {
    editor = ace.edit('json-editor' + this.props.id);
    const json = this.props.data;
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

  getValue: function() {
    return editor.getValue();
  },

  render: function () {
    return (
      <div className='json-editor-container'>
        <div id={'json-editor' + this.props.id}></div>
      </div>
    );
  },

});

module.exports = JSONEditor;