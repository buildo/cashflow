/** @jsx React.DOM */

'use strict';

const React = require('react');
const LoginForm = require('./LoginForm.jsx');
const CurrentUserStore = require('../../store/CurrentUserStore.js');

const getStateFromStores = function () {
  return {
    loginState: CurrentUserStore.getLoginState(),
  };
};

const LoginMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    CurrentUserStore.addChangeListener(this._onChange);
  },

  render: function() {

    const loginForm = <LoginForm loginState={this.state.loginState}/>;

    return (
      <div className="login-main">
        <LoginForm/>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = LoginMain;
