/** @jsx React.DOM */

'use strict';

const React = require('react');
const Navigation = require('react-router').Navigation;
const C = require('../../constants/AppConstants').ActionTypes;
const LoginForm = require('./LoginForm.jsx');
const LoginStore = require('../../store/LoginStore.js');
const LoginActions = require('../../actions/LoginActions.js');

const getStateFromStores = function () {
  return {
    loginState: LoginStore.getLoginState(),
  };
};

const LoginMain = React.createClass({

  mixins: [Navigation],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    LoginStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    LoginStore.removeChangeListener(this._onChange);
  },

  render: function() {

    if (this.state.loginState === C.LOGGED_IN) {
      return <div/>;
    }

    return (
      <div className="login-main">
        <LoginForm loginState={this.state.loginState}/>
      </div>
    );
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (nextState.loginState === C.LOGGED_IN) {
      LoginActions.resetLoginState();
      this.transitionTo('app');
    }
    return false;
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = LoginMain;
