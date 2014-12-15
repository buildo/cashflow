/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const Navigation = require('react-router').Navigation;
const State = require('react-router').State;
const TokenStore = require('../store/TokenStore.js');
const ServerActions = require('../actions/ServerActions.js');
const RouterActions = require('../actions/RouterActions.js');
const C = require('../constants/AppConstants').ActionTypes;

const getStateFromStores = function () {
  return {
    tokenState: TokenStore.getTokenState()
  };
};

const App = React.createClass({

  mixins: [Navigation, State],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    TokenStore.addChangeListener(this._onChange);
    ServerActions.checkTokenState();
  },

  componentWillUnmount: function() {
    TokenStore.removeChangeListener(this._onChange);
  },

  render: function () {
    console.log('RENDER_ROOT');

    switch (this.state.tokenState) {

      case C.TOKEN_IS_INVALID:
        if (this.getPathname() !== '/login') {
          this.replaceWith('login');
          return <div/>;
        }
        break;

      case C.TOKEN_IS_VALID:
        if (this.getPathname() === '/') {
          this.replaceWith('/analytics');
          return <div/>;
        }
        break;

      default:
        return <div/>;
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

module.exports = App;