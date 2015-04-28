/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const ace = require('brace');
require('brace/mode/json');
require('brace/theme/textmate');

const validateCFF = require('cashflow').validateCFF;

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
    const id = this.props.id || ('' + (new Date()).getTime());

    const initialData = this.props.data || {};

    return { initialData, id };
  },

  componentDidMount: function() {
    this._initializeEditor(() => {
      this.setValue(this.state.initialData);
    });
  },

  _initializeEditor(cb) {
    const editor = ace.edit('json-editor' + this.state.id);
    editor.on('change', this.onChange);
    editor.setOptions({
      mode: 'ace/mode/json',
      theme: 'ace/theme/textmate',
      maxLines: Infinity,
      tabSize: 2,
      autoScrollEditorIntoView: true,
      wrap: true
    });
    this.setState({editor}, cb);
  },

  _getValue: function() {
    return this.state.editor.getValue();
  },

  resetData: function() {
    //this.state.editor.destroy();
    this.setValue(this.state.initialData);
  },

  onChange() {
    this.props.onDocumentChange(this._getValue());
  },

  setValue: function(data) {
    this.state.editor.setValue(JSON.stringify(data, undefined, 2));
    this.state.editor.clearSelection();
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
