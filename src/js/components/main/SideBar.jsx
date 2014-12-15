/** @jsx React.DOM */

'use strict';

const React = require('react'),
  PageSelector = require('./PageSelector.jsx');

const SideBar = React.createClass({

  componentDidMount: function() {
  },

  render: function () {

    const pageSelectors = this.props.pages.map((page, index) =>
      <PageSelector page={page} selectedPage={this.props.selectedPage} selectedTab={this.props.selectedTab} key={index}/>);

    return (
      <div className='sideBar'>
        <h4 className='ui top attached inverted header'>
          PAGES
        </h4>
        <div className='ui top attached fluid vertical menu'>
          {pageSelectors}
        </div>
      </div>
    );
  }

});

module.exports = SideBar;
