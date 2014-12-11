/** @jsx React.DOM */

'use strict';

const React = require('react');

const TabSelector = React.createClass({

  componentDidMount: function () {
  },

  render: function () {

    return (
      <a className='item'>{this.props.tab.name}</a>
    );
  }

});

module.exports = TabSelector;

