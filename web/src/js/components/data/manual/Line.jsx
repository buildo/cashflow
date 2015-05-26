/** @jsx React.DOM */

'use strict';

const React = require('react/addons');
const _ = require('lodash');
const JSONEditor = require('./JSONEditor.jsx');

const Line = React.createClass({

  propTypes: {
    onSave: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    _id: React.PropTypes.string.isRequired,
    line: React.PropTypes.object,
    loading: React.PropTypes.bool,
    error: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      line: {
        flowDirection: 'in/out',
        description: 'MANUAL',
        currency: {
          name: 'EUR',
          conversion: 1
        },
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

  getInitialState() {
    return {
      value: this.stringifyJSON(this.props.line),
      modified: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      modified: this.stringifyJSON(nextProps.line) !== this.state.value
    });
  },

  parseJSON(value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return;
    }
  },

  saveLine() {
    if (!this.props.loading) {
      this.props.onSave({line: this.parseJSON(this.state.value), id: this.props._id});
    }
  },

  deleteLine() {
    if (!this.props.loading) {
      this.props.onDelete({line: this.parseJSON(this.state.value), id: this.props._id});
    }
  },

  onDocumentChange(value) {
    const hasBeenModified = this.stringifyJSON(this.props.line) !== value;
    this.setState({
      value: value,
      modified: hasBeenModified,
    });
  },

  resetEditor() {
    this.setState({
      value: this.stringifyJSON(this.props.line),
      modified: false
    });
    console.log(JSON.parse(this.state.value), this.props.line);
  },

  stringifyJSON(data) {
    return JSON.stringify(data, undefined, 2);
  },

  getErrorMessage() {
    if (this.props.error) {
      return (
        <div className='ui negative message'>
          <div className='header'>{this.props.error}</div>
        </div>
      );
    }
  },

  render () {
    const cx = React.addons.classSet;
    const saveButtonClasses = cx({
      ui: true,
      positive: this.state.modified,
      disabled: !this.state.modified,
      button: true,
    });

    const resetButtonClasses = cx({
      ui: true,
      disabled: !this.state.modified,
      button: true
    });

    return (
      <div style={{marginTop: '2em'}}>
        <div className='ui header' style={{marginBottom: '0'}}>ID: {this.props._id}</div>
        <div className={'ui' + (this.props.loading ? ' loading' : '') + ' segment manual-line'} style={{marginTop: '5px'}}>
          <JSONEditor id={this.props._id} value={this.state.value} onChange={this.onDocumentChange} />
          <div style={{padding: '5px'}}>
            <div className='ui negative button' onClick={this.deleteLine}>Elimina</div>
            <div className={resetButtonClasses} onClick={this.resetEditor}>Annulla Modifiche</div>
            <div className={saveButtonClasses} onClick={this.saveLine}>Salva</div>
          </div>
        </div>
        {this.getErrorMessage()}
      </div>

    );
  },

});

module.exports = Line;
