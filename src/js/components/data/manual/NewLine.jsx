/** @jsx React.DOM */

'use strict';

const React = require('react');
const Line = require('./Line.jsx');

const NewLine = React.createClass({

  getInitialState: function() {
    return {
      isAdding: false
    };
  },

  addLine: function() {
    this.setState({isAdding: true});
  },

  render: function () {
    const button = <div className='ui blue button' onClick={this.addLine}>Aggiungi Linea</div>;
    const line = <Line key='new'/>;
    return this.state.isAdding ? line : button;
  },

});

module.exports = NewLine;