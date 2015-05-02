/** @jsx React.DOM */

'use strict';

const React = require('react');
const Immutable = require('immutable');
const ace = require('brace');
require('brace/mode/json');
require('brace/theme/textmate');

const validateCFF = require('cashflow-core').validateCFF;

const JSONEditor = React.createClass({

  propTypes: {
    id: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      id: '' + (new Date()).getTime(),
      value: '{}',
    };
  },

  componentDidMount() {
    this._initializeEditor(() => {
      this.setValue(this.props.value);
    });
  },

  _initializeEditor(cb) {
    const editor = ace.edit('json-editor' + this.props.id);
    editor.on('change', this.onChange);
    editor.setOptions({
      mode: 'ace/mode/json',
      theme: 'ace/theme/textmate',
      maxLines: Infinity,
      tabSize: 2,
      autoScrollEditorIntoView: true,
      wrap: true
    });
    editor.$blockScrolling = Infinity;
    this.setState({editor}, cb);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.getValue()) {
      this.setValue(nextProps.value);
    }
  },

  onChange() {
    this.props.onChange(this.getValue());
  },

  getValue() {
    return this.state.editor.getValue();
  },

  setValue(data) {
    this.state.editor.setValue(data);
    this.state.editor.clearSelection();
  },

  render () {
    return (
      <div className='json-editor-container'>
        <div className='json-editor' id={'json-editor' + this.props.id} />
      </div>
    );
  },

});

module.exports = JSONEditor;
