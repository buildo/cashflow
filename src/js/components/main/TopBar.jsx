/** @jsx React.DOM */

'use strict';

const React = require('react');
const Link = require('react-router').Link;
const LoginActions = require('../../actions/LoginActions.js');


const TopBar = React.createClass({

  getToken: function() {
    console.log(localStorage.getItem('cashflow_token'));
  },

  logOut: function() {
    LoginActions.logOut();
  },

  componentDidMount: function() {
    $(this.refs.dropdownMenu.getDOMNode()).dropdown();
  },

  render: function () {

    const selectedPage = this.props.selectedPage;
    const pages = this.props.pages.map((page, index) => {
      const classes = page.id === selectedPage ? 'active item' : 'item';
      return (
        <Link className={classes} to={page.id} key={index}>
          {page.name}
        </Link>
      );
    });

    const currentTabs = this.props.pages.filter((page) => page.id === selectedPage)[0].tabs;
    const tabs = currentTabs.map((tab, index) => {
      return (
        <Link className='item' to={tab.id} key={index}>
          {tab.name}
        </Link>
      );
    });

    return (
      <div className='ui tiered menu'>
        <div className='menu'>
          {pages}
          <div className='right menu'>
            <div className='item'>
              <div className='ui icon input'>
                <input type='text' placeholder='Search...'/>
                <i className='search icon'></i>
              </div>
            </div>
            <div ref='dropdownMenu' className='ui dropdown item'>
              More
              <i className='icon dropdown'></i>
              <div className='menu'>
                <div className='item' onClick={this.getToken}><i className='edit icon'></i> Get Token</div>
                <div className='item' onClick={this.logOut}><i className='globe icon'></i> Log Out</div>
                <div className='item'><i className='settings icon'></i> Account Settings</div>
              </div>
            </div>
          </div>
        </div>
        <div className='ui sub menu'>
          {tabs}
        </div>
      </div>
    );
  }

});

module.exports = TopBar;
