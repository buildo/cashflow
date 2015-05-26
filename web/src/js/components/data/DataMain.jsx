/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const ListenerMixin = require('alt/mixins/ListenerMixin');
const CFFActions = require('../../actions/CFFActions');
const CFFStore = require('../../store/CFFStore.js');
const ManualCFFDataStore = require('../../store/ManualCFFDataStore.js');

const getStateFromStores = function () {
  return CFFStore.getState();
};

const DataMain = React.createClass({

  mixins: [ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(CFFStore, this._onChange);
    this.listenTo(ManualCFFDataStore, this._updateManualLines);
    if (!this.state.main) {
      CFFActions.getMain.defer();
    }
    if (!this.state.bank) {
      CFFActions.getBank.defer();
    }
    if (!this.state.manual || ManualCFFDataStore.getState().outdated) {
      CFFActions.getManual.defer();
    }
  },

  render: function () {
    return <RouteHandler/>;
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  },

  _updateManualLines: function() {
    if (ManualCFFDataStore.getState().outdated) {
      CFFActions.getManual.defer();
    }
  }

});

module.exports = DataMain;