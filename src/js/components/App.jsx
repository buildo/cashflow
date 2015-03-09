/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const Navigation = require('react-router').Navigation;
const State = require('react-router').State;
const ListenerMixin = require('alt/mixins/ListenerMixin');
const TokenStore = require('../store/TokenStore.js');
const TokenActions = require('../actions/TokenActions.js');
const C = require('../constants/AppConstants').ActionTypes;

const getStateFromStores = function () {
  return TokenStore.getState();
};

const App = React.createClass({

  mixins: [Navigation, State, ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(TokenStore, this._onChange);
    TokenActions.checkToken();
  },

  render: function () {
    // console.log('RENDER_ROOT');

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