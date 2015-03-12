/** @jsx React.DOM */

'use strict';

const React = require('react');
const Line = require('./Line.jsx');

const NewLine = React.createClass({

  propTypes: {
    onSave: React.PropTypes.func.isRequired,
    isCreating: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      isAdding: false,
      id: '' + (new Date()).getTime()
    };
  },

  show: function() {
    this.setState({isAdding: true});
  },

  hide: function() {
    this.setState(this.getInitialState());
  },

  onSave: function(obj) {
    this.props.onSave(obj, this.onSaveCallback);
  },

  render: function () {
    const button = <div className='ui blue button' onClick={this.show}>Aggiungi Linea</div>;
    const line = <Line onSave={this.onSave} onDelete={this.hide} id={this.state.id} isLoading={this.props.isCreating} />;
    return (
      <div className='new-manual-line'>
        {this.state.isAdding ? line : button}
      </div>
    );
  },

});

module.exports = NewLine;