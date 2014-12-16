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

const DataMain = React.createClass({

  componentDidMount: function() {
    CFFStore.addChangeListener(this._onChange);
    if (!CFFStore.getMainCFF()) {
      ServerActions.getMain();
    }

    if (!CFFStore.getBankCFF()) {
      ServerActions.getBank();
    }
  },

  render: function () {
    console.log('RENDER_DATA');
    return (
      <RouteHandler/>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = DataMain;