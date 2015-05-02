/** @jsx React.DOM */

'use strict';

const React = require('react');
const Navigation = require('react-router').Navigation;
const AppConstants = require('../../constants/AppConstants');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const LoginForm = require('./LoginForm.jsx');
const LoginStore = require('../../store/LoginStore.js');
const LoginActions = require('../../actions/LoginActions.js');

const getStateFromStores = function () {
  return LoginStore.getState();
};

const LoginMain = React.createClass({

  mixins: [Navigation, ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(LoginStore, this._onChange);
  },

  _onFormSubmit: function(formData) {
    LoginActions.login(formData);
  },

  render: function() {

    if (this.state.loginState === AppConstants.LOGIN_SUCCESS) {
      return null;
    }

    return (
      <div className="login-main">
        <LoginForm loginState={this.state.loginState} onSubmit={this._onFormSubmit}/>
      </div>
    );
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (nextState.loginState === AppConstants.LOGIN_SUCCESS) {
      LoginActions.resetLoginState.defer();
      this.transitionTo('app');
    }
    return false;
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = LoginMain;
