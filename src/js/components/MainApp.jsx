/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const Navigation = require('react-router').Navigation;
const TokenStore = require('../store/TokenStore.js');
const ServerActions = require('../actions/ServerActions.js');
const Home = require('./home/Home.jsx');
const LoginMain = require('./login/LoginMain.jsx');
const C = require('../constants/AppConstants').ActionTypes;


const getStateFromStores = function () {
  return {
    tokenState: TokenStore.getTokenState()
  };
};

const MainApp = React.createClass({

  mixins: [Navigation],

  getInitialState: function() {
    ServerActions.checkTokenState();
    return getStateFromStores();
  },

  componentDidMount: function() {
    TokenStore.addChangeListener(this._onChange);
  },

  render: function () {

    switch (this.state.tokenState) {

      case C.CHECKING_TOKEN_STATE:
        console.log('checking token state');
        return <div/>;

      case C.TOKEN_IS_INVALID:
        this.replaceWith('login');
        break;

      case C.TOKEN_IS_VALID:
        break;
    }

    return (
      <div id='main-app'>
        <RouteHandler/>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = MainApp;