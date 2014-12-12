/** @jsx React.DOM */

'use strict';

const React = require('react');
const LoginForm = require('./LoginForm.jsx');
const LoginStore = require('../../store/LoginStore.js');

const getStateFromStores = function () {
  return {
    loginState: LoginStore.getLoginState(),
  };
};

const LoginMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    LoginStore.addChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div className="login-main">
        <LoginForm loginState={this.state.loginState}/>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = LoginMain;
