/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const Navigation = require('react-router').Navigation;
const State = require('react-router').State;
const ListenerMixin = require('alt/mixins/ListenerMixin');
const CFFActions = require('../actions/CFFActions.js');
const MatchActions = require('../actions/MatchActions.js');
const TokenStore = require('../store/TokenStore.js');
const TokenActions = require('../actions/TokenActions.js');
const AppConstants = require('../constants/AppConstants');

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
    switch (this.state.tokenState) {

      case AppConstants.TOKEN_FAIL:
        if (this.getPathname() !== '/login') {
          this.replaceWith('login');
          return null;
        }
        break;

      case AppConstants.TOKEN_SUCCESS:
        if (this.getPathname() === '/') {
          this.replaceWith('/analytics');
          return null;
        }
        break;

      default:
        return null;
    }

    return (
      <div id='root'>
        <RouteHandler/>
      </div>
    );
  },

  initStores: function() {
    CFFActions.getMain.defer();
    CFFActions.getBank.defer();
    CFFActions.getManual.defer();
    MatchActions.getMatches.defer();
  },

  _onChange: function() {
    this.setState(getStateFromStores());
    if (this.state.tokenState === AppConstants.TOKEN_SUCCESS) {
      this.initStores();
    }
  }

});

module.exports = App;