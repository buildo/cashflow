/** @jsx React.DOM */

'use strict';

const React = require('react');
const ManualCffEditor = require('./ManualCffEditor.jsx');
const CFFStore = require('../../../store/CFFStore.js');
const ServerActions = require('../../../actions/ServerActions.js');


const getStateFromStores = function () {
  return {
    isLoadingManualCFF: CFFStore.isLoadingManual(),
    manualCFF: CFFStore.getManualCFF()
  };
};

const ManualMain = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    CFFStore.addChangeListener(this._onChange);
    ServerActions.getManual();
  },

  componentWillUnmount: function() {
    CFFStore.removeChangeListener(this._onChange);
  },

  render: function() {

    if (this.state.isLoadingManualCFF) {
      return <div/>;
    }

    const manualCFF = this.state.manualCFF && this.state.manualCFF.lines ? this.state.manualCFF : undefined;

    return (
      <div>
        <ManualCffEditor manualCFF={manualCFF}/>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = ManualMain;

