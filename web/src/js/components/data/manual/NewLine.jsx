/** @jsx React.DOM */

'use strict';

const React = require('react');
const ManualActions = require('../../../actions/ManualActions');
const Line = require('./Line.jsx');

const NewLine = React.createClass({

  propTypes: {
    onSave: React.PropTypes.func.isRequired,
    _id: React.PropTypes.string.isRequired,
    show: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    error: React.PropTypes.string
  },

  show() {
    ManualActions.showNewLine();
  },

  hide() {
    ManualActions.hideNewLine();
  },

  onSave(obj) {
    this.props.onSave(obj);
  },

  getLine() {
    return (
      <Line
        onSave={this.onSave}
        onDelete={this.hide}
        _id={this.props._id}
        loading={this.props.loading}
        error={this.props.error}
        />
    );
  },

  render() {
    const button = <div className='ui blue button' onClick={this.show}>Aggiungi Linea</div>;
    return (
      <div className='new-manual-line'>
        {this.props.show ? this.getLine() : button}
      </div>
    );
  },

});

module.exports = NewLine;