/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const ServerActions = require('../../actions/ServerActions');
const CFFStore = require('../../store/CFFStore.js');

const getStateFromStores = function () {
  return {
    isLoadingCFFs: CFFStore.isLoading(),
  };
};

const AnalyticsMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    CFFStore.addChangeListener(this._onChange);
    if (!CFFStore.getMainCFF()) {
      ServerActions.getMain();
    }
    if (!CFFStore.getBankCFF()) {
      ServerActions.getBank();
    }
    if (!CFFStore.getManualCFF()) {
      ServerActions.getManual();
    }
  },

  componentWillUnmount: function() {
    CFFStore.removeChangeListener(this._onChange);
  },

  render: function () {
    return (
      <div>
        <RouteHandler isLoadingCFFs={this.state.isLoadingCFFs}/>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = AnalyticsMain;