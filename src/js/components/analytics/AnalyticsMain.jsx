/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const _ = require('lodash');
const ListenerMixin = require('alt/mixins/ListenerMixin');
const CFFActions = require('../../actions/CFFActions');
const CFFStore = require('../../store/CFFStore.js');
const MatchesStore = require('../../store/MatchesStore.js');

const getStateFromStores = function () {
  return _.extend(CFFStore.getState(), MatchesStore.getState());
};

const AnalyticsMain = React.createClass({

  mixins: [ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(CFFStore, this._onChange);
    this.listenTo(MatchesStore, this._onChange);
    // if (!this.state.main) {
    //   CFFActions.getMain.defer();
    // }
    // if (!this.state.bank) {
    //   CFFActions.getBank.defer();
    // }
    // if (!this.state.manual) {
    //   CFFActions.getManual.defer();
    // }
  },

  render: function () {
    const isLoadingData = this.state.isLoadingMain || this.state.isLoadingBank || this.state.isLoadingManual || this.state.isLoadingMatches;
    return <RouteHandler isLoadingData={isLoadingData}/>;
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = AnalyticsMain;