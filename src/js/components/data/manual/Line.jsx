/** @jsx React.DOM */

'use strict';

const React = require('react');
const _ = require('lodash');
const JSONEditor = require('./JSONEditor.jsx');

const Line = React.createClass({

  propTypes: {
    editorId: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]),
    onSave: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    line: React.PropTypes.object,
    id: React.PropTypes.string,
    isLoading: React.PropTypes.bool
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
      },
      id: '' + (new Date()).getTime(),
    };
  },

  getInitialState: function() {
    return {
      saveButtonState: 'disabled',
      resetButtonState: 'disabled',
      line: this.props.line,
      id: this.props.id
    };
  },

  getJSON: function() {
    try {
      const value = this.refs.jsonEditor.getValue();
      return JSON.parse(value);
    } catch (e) {
      return;
    }
  },

  saveLine: function() {
    if (!this.props.isLoading) {
      this.props.onSave({line: this.getJSON(), id: this.state.id});
    }
  },

  deleteLine: function() {
    if (!this.props.isLoading) {
      this.props.onDelete({line: this.getJSON(), id: this.state.id});
    }
  },

  onDocumentChange: function() {
    const hasBeenModified = _.isEqual(this.state.line, this.getJSON());
    this.setState({saveButtonState: hasBeenModified ? 'disabled' : 'positive'});
    this.setState({resetButtonState: hasBeenModified ? 'disabled' : 'neutral'});
  },

  resetEditor: function() {
    this.refs.jsonEditor.resetData();
    this.setState({saveButtonState: 'disabled'});
    this.setState({resetButtonState: 'disabled'});
  },

  render: function () {
    return (
      <div className={'ui' + (this.props.isLoading ? ' loading' : '') + ' segment manual-line'}>
        <JSONEditor data={this.state.line} onDocumentChange={this.onDocumentChange} ref='jsonEditor'/>
        <div style={{padding: '5px'}}>
          <div className='ui negative button' onClick={this.deleteLine}>Elimina</div>
          <div className={'ui ' + this.state.resetButtonState + ' button'} onClick={this.resetEditor}>Annulla Modifiche</div>
          <div className={'ui ' + this.state.saveButtonState + ' button'} onClick={this.saveLine}>Salva</div>
        </div>
      </div>
    );
  },

});

module.exports = Line;