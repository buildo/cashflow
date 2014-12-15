/** @jsx React.DOM */

'use strict';

const React = require('react');
const Link = require('react-router').Link;

const TabSelector = React.createClass({

  render: function () {

    return (
      <Link className="item" to={this.props.tab.id}>
        {this.props.tab.name}
      </Link>
    );
  }

});

module.exports = TabSelector;

