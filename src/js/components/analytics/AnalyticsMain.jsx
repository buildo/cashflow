/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const ServerActions = require('../../actions/ServerActions');
const CFFStore = require('../../store/CFFStore.js');

const getStateFromStores = function () {
  return {
    isLoadingMainCFF: CFFStore.isLoading(),
  };
};

const AnalyticsMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    CFFStore.addChangeListener(this._onChange);
    if (!CFFStore.getMainCFF()) {
      ServerActions.updateMain();
    }
  },

  componentWillUnmount: function() {
    CFFStore.removeChangeListener(this._onChange);
  },

  render: function () {
    console.log('RENDER_ANALYTICS');
    return (
      <div>
        <RouteHandler isLoadingMainCFF={this.state.isLoadingMainCFF}/>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = AnalyticsMain;